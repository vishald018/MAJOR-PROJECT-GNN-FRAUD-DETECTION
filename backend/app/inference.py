import json
import os
import torch
from torch_geometric.utils import k_hop_subgraph
from torch.nn.functional import sigmoid
import torch.nn.functional as F
import pandas as pd

from .config import BENEF_2008_PROC, BENEF_2010_PROC, PROCESSED_DIR
from .anomaly import z_score_anomaly_scores, top_anomalies

DEMOGRAPHIC_COLS = [
    "BENE_SEX_IDENT_CD",
    "BENE_RACE_CD",
    "BENE_ESRD_IND",
    "SP_STATE_CODE",
    "BENE_COUNTY_CD",
]
CHRONIC_FLAGS = [
    "SP_ALZHDMTA", "SP_CHF", "SP_CHRNKIDN", "SP_CNCR", "SP_COPD",
    "SP_DEPRESSN", "SP_DIABETES", "SP_ISCHMCHT", "SP_OSTEOPRS",
    "SP_RA_OA", "SP_STRKETIA",
]
PAYMENT_FIELDS = [
    "MEDREIMB_IP", "BENRES_IP", "PPPYMT_IP",
    "MEDREIMB_OP", "BENRES_OP", "PPPYMT_OP",
    "MEDREIMB_CAR", "BENRES_CAR", "PPPYMT_CAR",
]
FEATURE_COLUMNS_PATH = os.path.join(PROCESSED_DIR, "feature_columns.json")

_feature_columns = None
_payment_mean = None
_payment_std = None


def _load_feature_columns():
    global _feature_columns
    if _feature_columns is None:
        with open(FEATURE_COLUMNS_PATH, "r") as f:
            _feature_columns = json.load(f)
    return _feature_columns


def _load_payment_stats():
    global _payment_mean, _payment_std
    if _payment_mean is None or _payment_std is None:
        b8 = pd.read_csv(BENEF_2008_PROC, usecols=PAYMENT_FIELDS)
        b10 = pd.read_csv(BENEF_2010_PROC, usecols=PAYMENT_FIELDS)
        payments = pd.concat([b8, b10], ignore_index=True)
        payments = payments.apply(pd.to_numeric, errors="coerce").fillna(0)
        _payment_mean = payments.mean()
        _payment_std = payments.std().replace(0, 1.0).fillna(1.0)
    return _payment_mean, _payment_std


def _build_feature_vector(claim):
    """Build the exact 395-dimensional feature vector used by graph_builder."""
    # graph_builder reads processed CSVs as strings, so preserve the same
    # categorical representation, including zero-padding for state/county.
    esrd = "Y" if int(claim["bene_esrd_ind"]) == 1 else "0"
    demo = pd.DataFrame([{
        "BENE_SEX_IDENT_CD": str(int(claim["bene_sex_ident_cd"])),
        "BENE_RACE_CD": str(int(claim["bene_race_cd"])),
        "BENE_ESRD_IND": esrd,
        "SP_STATE_CODE": str(int(claim["sp_state_code"])).zfill(2),
        "BENE_COUNTY_CD": str(int(claim["bene_county_cd"])).zfill(3),
    }])

    encoded = pd.get_dummies(
        demo,
        columns=DEMOGRAPHIC_COLS,
        prefix=DEMOGRAPHIC_COLS,
        dummy_na=False,
    )
    encoded = encoded.reindex(columns=_load_feature_columns(), fill_value=0)
    encoded_tensor = torch.tensor(encoded.to_numpy(dtype="float32")[0])

    chronic = torch.tensor(
        [float(claim["sp_conditions"].get(k, 2)) for k in CHRONIC_FLAGS],
        dtype=torch.float32,
    )

    raw_payments = pd.Series({
        k: float(claim["payments"].get(k, 0.0)) for k in PAYMENT_FIELDS
    })
    mean, std = _load_payment_stats()
    normalized = ((raw_payments - mean) / std).fillna(0.0)
    payment_tensor = torch.tensor(normalized.to_numpy(dtype="float32"))

    indicator = torch.tensor([0.0], dtype=torch.float32)
    x_feat = torch.cat([encoded_tensor, chronic, payment_tensor, indicator])

    if x_feat.numel() != 395:
        raise ValueError(f"Feature vector has {x_feat.numel()} dimensions; expected 395")
    return x_feat


def compute_temp_embedding(claim, data, model, node_mapping):
    device = next(model.parameters()).device
    model.eval()
    x_new = _build_feature_vector(claim).unsqueeze(0).to(device)

    provider_id = str(claim["provider_id"])
    if provider_id not in node_mapping:
        raise ValueError(f"Provider ID {provider_id} not found in node mapping.")
    provider_idx = node_mapping[provider_id]

    x_full = torch.cat([data.x.to(device), x_new], dim=0)
    new_node_idx = x_full.size(0) - 1

    edge_index = data.edge_index.to(device)
    extra_edges = torch.tensor(
        [[new_node_idx, provider_idx], [provider_idx, new_node_idx]],
        dtype=torch.long,
        device=device,
    )
    edge_index_full = torch.cat([edge_index, extra_edges], dim=1)

    with torch.no_grad():
        z_all = model.encode(x_full, edge_index_full)

    z_new = z_all[new_node_idx]
    z_existing = z_all[:-1]
    z_norm = F.normalize(z_existing, p=2, dim=1)
    z_new_norm = F.normalize(z_new, p=2, dim=0)
    scores = torch.matmul(z_norm, z_new_norm)

    # 1. Intrinsic Anomaly Score (S_int)
    # Normalize new node's z-score relative to population
    z_all = torch.cat([z_existing, z_new.unsqueeze(0)], dim=0)
    all_anomaly_scores = z_score_anomaly_scores(z_all)

    mu = all_anomaly_scores[:-1].mean()
    sigma = all_anomaly_scores[:-1].std() + 1e-6
    current_score = all_anomaly_scores[-1]

    # Shifted sigmoid: Average anomaly maps to ~12%, 2-sigma to 50%, 4-sigma to ~88%
    s_int = torch.sigmoid((current_score - mu) / sigma - 2).item()

    # 2. Similarity to Anomalies (S_sim)
    # Get top 50 most anomalous existing nodes
    top_idx, _ = top_anomalies(z_existing, top_k=50)
    z_anomalies = z_norm[top_idx]

    # Cosine similarity to these anomalies
    sim_to_anomalies = torch.matmul(z_anomalies, z_new_norm)
    # Use ReLU to focus on positive similarity; mean of these values
    s_sim = torch.relu(sim_to_anomalies).mean().item()

    # 3. Combined Fraud Score (0.0 to 1.0)
    # Balance intrinsic weirdness and similarity to other weird things
    fraud_score = (0.5 * s_int) + (0.5 * s_sim)
    # Clip to [0, 1] just in case
    fraud_score = max(0.0, min(1.0, fraud_score))

    topk = min(5, scores.numel())
    top_vals, top_indices = torch.topk(scores, k=topk)
    top_neighbors = [
        {"node_index": int(i), "score": round(float(s), 4)}
        for i, s in zip(top_indices, top_vals)
    ]
    return fraud_score, top_neighbors, z_new


def get_fraud_score(claim_id: str, data, z, node_mapping: dict, num_hops: int = 5, topk: int = 1):
    if claim_id not in node_mapping:
        raise ValueError(f"Claim ID {claim_id} not found in node mapping.")

    node_index = node_mapping[claim_id]
    subset, _, _, _ = k_hop_subgraph(
        node_index, num_hops=num_hops,
        edge_index=data.edge_index, relabel_nodes=False
    )

    target_embedding = z[node_index]
    neighbor_embeddings = z[subset]
    scores = torch.matmul(neighbor_embeddings, target_embedding)
    sigmoid_scores = sigmoid(scores)
    fraud_score = sigmoid_scores.mean().item()

    topk = min(topk, sigmoid_scores.numel())
    top_scores, top_indices = torch.topk(sigmoid_scores, k=topk)
    top_neighbors = [
        {"node_index": int(subset[i]), "score": round(float(score), 4)}
        for i, score in zip(top_indices, top_scores)
    ]

    return {
        "claim_id": claim_id,
        "fraud_score": round(fraud_score, 4),
        "top_neighbors": top_neighbors,
    }
