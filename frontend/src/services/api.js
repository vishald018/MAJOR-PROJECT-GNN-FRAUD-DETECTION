const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '')

const CONDITION_IDS = {
  alzheimer: 'SP_ALZHDMTA',
  heart_failure: 'SP_CHF',
  kidney_disease: 'SP_CHRNKIDN',
  cancer: 'SP_CNCR',
  pulmonary: 'SP_COPD',
  depression: 'SP_DEPRESSN',
  diabetes: 'SP_DIABETES',
  ischemic_heart: 'SP_ISCHMCHT',
  osteoporosis: 'SP_OSTEOPRS',
  rheumatoid: 'SP_RA_OA',
  stroke: 'SP_STRKETIA',
}

const PAYMENT_FIELDS = {
  inpatientMedicare: 'MEDREIMB_IP',
  inpatientBeneficiary: 'BENRES_IP',
  inpatientPrimary: 'PPPYMT_IP',
  outpatientMedicare: 'MEDREIMB_OP',
  outpatientBeneficiary: 'BENRES_OP',
  outpatientPrimary: 'PPPYMT_OP',
  carrierMedicare: 'MEDREIMB_CAR',
  carrierBeneficiary: 'BENRES_CAR',
  carrierPrimary: 'PPPYMT_CAR',
}

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function toBackendPayload(formData) {
  const conditions = {}
  Object.entries(CONDITION_IDS).forEach(([id, key]) => {
    conditions[key] = formData.conditions.includes(id) ? 1 : 2
  })

  const payments = {}
  Object.entries(PAYMENT_FIELDS).forEach(([uiKey, backendKey]) => {
    payments[backendKey] = toNumber(formData.payment[uiKey])
  })

  return {
    provider_id: formData.beneficiary.providerId.trim(),
    bene_sex_ident_cd: toNumber(formData.beneficiary.sex),
    bene_race_cd: toNumber(formData.beneficiary.race),
    bene_esrd_ind: formData.beneficiary.esrd === 'Y' ? 1 : 0,
    sp_state_code: toNumber(formData.beneficiary.state),
    bene_county_cd: toNumber(formData.beneficiary.county),
    sp_conditions: conditions,
    payments,
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  let body = null
  try {
    body = await response.json()
  } catch {
    // Keep the original HTTP error when the server returns no JSON.
  }

  if (!response.ok) {
    throw new Error(body?.detail || `Backend request failed (${response.status})`)
  }
  return body
}

function riskLevel(score) {
  if (score >= 70) return 'HIGH'
  if (score >= 40) return 'MEDIUM'
  return 'LOW'
}

function severityForScore(score) {
  if (score >= 70) return 'high'
  if (score >= 40) return 'medium'
  return 'low'
}

function buildAnalysis(result, formData) {
  const fraudScore = Math.round(Number(result.fraud_score) * 100)
  const anomalyScore = Number(result.anomaly_score)
  const neighbors = Array.isArray(result.top_neighbors) ? result.top_neighbors : []
  const absAnomaly = Math.abs(anomalyScore)
  const anomalySeverity = absAnomaly >= 2 ? 'high' : absAnomaly >= 1 ? 'medium' : 'low'

  return {
    claimId: result.claim_id,
    submittedAt: new Date().toISOString(),
    fraudScore,
    riskLevel: riskLevel(fraudScore),
    confidence: null,
    anomalyScore,
    inferenceTime: result.latency_ms != null ? Number(result.latency_ms) : null,
    riskFactors: [
      {
        id: 'graph_similarity',
        title: 'Graph Similarity Score',
        description: `The GNN backend returned a mean similarity-derived fraud score of ${fraudScore}%.`,
        severity: severityForScore(fraudScore),
        contribution: Math.max(0, Math.min(1, Number(result.fraud_score))),
      },
      {
        id: 'embedding_anomaly',
        title: 'Embedding Anomaly Score',
        description: `The new claim embedding has a z-score of ${anomalyScore.toFixed(3)} relative to the graph embeddings.`,
        severity: anomalySeverity,
        contribution: Math.max(0, Math.min(1, absAnomaly / 3)),
      },
    ],
    signals: [
      {
        id: 'fraud_score',
        label: 'GNN fraud score',
        active: fraudScore >= 40,
        weight: fraudScore,
      },
      {
        id: 'embedding_anomaly',
        label: 'Embedding anomaly magnitude',
        active: absAnomaly >= 1,
        weight: Math.round(Math.min(100, absAnomaly / 3 * 100)),
      },
      {
        id: 'provider_link',
        label: 'Provider graph linkage',
        active: true,
        weight: 100,
      },
    ],
    graph: {
      nodes: [
        { id: 'claim', label: result.claim_id, type: 'claim' },
        { id: 'provider', label: result.provider_id, type: 'provider' },
        ...neighbors.map((neighbor, index) => ({
          id: `neighbor-${index}`,
          label: `Node ${neighbor.node_index}`,
          type: 'neighbor',
        })),
      ],
      edges: [
        { source: 'claim', target: 'provider', weight: 1, kind: 'provider' },
        ...neighbors.map((neighbor, index) => ({
          source: 'claim',
          target: `neighbor-${index}`,
          weight: Math.max(0, Math.min(1, (Number(neighbor.score) + 1) / 2)),
          kind: 'similarity',
        })),
      ],
    },
    model: {
      name: result.model?.name || 'Graph Autoencoder',
      type: result.model?.type || 'GCN + GAE',
      variants: ['GCN + GAE'],
      features: `${result.model?.features ?? 395} graph features`,
      detection: result.model?.detection || 'Embedding similarity + anomaly score',
      inference: 'Real-Time API',
    },
    formSnapshot: formData,
  }
}

export async function checkHealth() {
  return request('/health')
}

export async function submitClaim(formData) {
  if (!formData.beneficiary.providerId.trim()) {
    throw new Error('Provider ID is required.')
  }
  const started = performance.now()
  const result = await request('/submit_claim', {
    method: 'POST',
    body: JSON.stringify(toBackendPayload(formData)),
  })
  const analysis = buildAnalysis(
    { ...result, latency_ms: result.latency_ms ?? performance.now() - started },
    formData,
  )
  return { claimId: analysis.claimId, analysis }
}

export async function getAnalysisResult(analysis) {
  return analysis
}
