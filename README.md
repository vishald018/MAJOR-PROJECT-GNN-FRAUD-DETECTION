# Fraud Detection using GNN

A full-stack fraud detection system that uses a **Graph Neural Network (GNN)** and **Graph Autoencoder (GAE)** to analyze healthcare claims and identify potentially anomalous or fraudulent behavior.

The project consists of:

* **FastAPI backend** for GNN inference and data processing
* **React + Vite frontend** for claim analysis and visualization
* **PyTorch / PyTorch Geometric** for the GNN model
* **Graph-based embedding similarity and anomaly detection**
* Processed healthcare claims and beneficiary data
* Real-time risk analysis through the frontend

---

## Project Structure

```text
fraud-detection-gnn/
│
├── backend/
│   └── app/
│       ├── __init__.py
│       ├── api.py                  # FastAPI API routes
│       ├── anomaly.py              # Embedding anomaly detection
│       ├── config.py               # Paths and configuration
│       ├── data_preprocess.py      # Data preprocessing
│       ├── graph_builder.py        # Graph construction
│       ├── inference.py            # Model inference
│       ├── main.py                 # FastAPI application
│       ├── model.py                # GNN / GAE model definition
│       └── train.py                # Model training
│
├── data/
│   └── processed/
│       ├── claims_processed.csv
│       ├── beneficiary_2008.csv
│       ├── beneficiary_2010.csv
│       ├── feature_columns.json
│       ├── node_mapping.json
│       └── sample_test_cases.json
│
├── models/
│   └── gae_model.pt               # Trained GNN/GAE model
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       │
│       ├── components/
│       │   ├── analyzer/
│       │   │   ├── ClaimForm.jsx
│       │   │   ├── ConditionCard.jsx
│       │   │   ├── FormSection.jsx
│       │   │   ├── GraphVisualization.jsx
│       │   │   ├── PaymentSection.jsx
│       │   │   └── RiskEngine.jsx
│       │   │
│       │   ├── analyzing/
│       │   │   └── AnalysisLoader.jsx
│       │   │
│       │   ├── common/
│       │   │   ├── Field.jsx
│       │   │   ├── MetricCard.jsx
│       │   │   └── SectionLabel.jsx
│       │   │
│       │   ├── layout/
│       │   │   └── Navbar.jsx
│       │   │
│       │   └── results/
│       │       ├── ClaimNetworkGraph.jsx
│       │       ├── ModelIntelligence.jsx
│       │       ├── RiskFactorCard.jsx
│       │       ├── RiskGauge.jsx
│       │       ├── RiskSignals.jsx
│       │       └── RiskSummary.jsx
│       │
│       ├── context/
│       │   └── ClaimContext.jsx
│       │
│       ├── data/
│       │   └── formOptions.js
│       │
│       ├── pages/
│       │   ├── Analyzer.jsx
│       │   ├── Analyzing.jsx
│       │   └── Results.jsx
│       │
│       └── services/
│           └── api.js
│
├── .gitignore
├── README.md
└── LICENSE
```

---

# System Architecture

```text
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                               │ HTTP API
                               ▼
                    ┌─────────────────────┐
                    │      FastAPI        │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │ Graph       │ │ GNN / GAE    │ │ Anomaly     │
        │ Builder     │ │ Inference    │ │ Detection   │
        └─────────────┘ └─────────────┘ └─────────────┘
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │   Risk Analysis     │
                    │ Similarity + Anomaly│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Results Dashboard   │
                    │ Risk / Graph / Model │
                    └─────────────────────┘
```

---

# Key Features

### Claim Analysis

The frontend provides a claim analysis interface where users can enter beneficiary, medical condition, and payment information.

### GNN-Based Detection

The backend uses a trained Graph Neural Network / Graph Autoencoder to generate graph embeddings and analyze relationships between entities.

### Embedding Similarity

The system compares the new claim representation against existing graph embeddings to identify similar entities and relationships.

### Anomaly Detection

An anomaly score is calculated using the generated embedding and its relationship with the existing graph representation.

### Risk Analysis

The frontend displays:

* Risk score
* Risk band
* GNN similarity score
* Embedding anomaly score
* Provider graph linkage
* Similarity network
* Model information
* API latency
* Risk signals

### Real-Time API

The React frontend communicates with the FastAPI backend to perform real-time inference.

---

# Running the Full Stack

## 1. Backend

Open a terminal and navigate to the project:

```powershell
cd "D:\Major Project\fraud-detection-gnn-main"
```

Create a Python virtual environment:

```powershell
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Navigate to the backend:

```powershell
cd backend
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start the FastAPI server:

```powershell
python -m uvicorn app.main:app --reload --port 8000
```

The backend will be available at:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

---

# 2. Frontend

Open a **second terminal**.

Navigate to the frontend:

```powershell
cd "D:\Major Project\fraud-detection-gnn-main\frontend"
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

---

# Running the Application

Both servers must be running simultaneously.

### Terminal 1 — Backend

```powershell
cd "D:\Major Project\fraud-detection-gnn-main\backend"
.\..\ .venv\Scripts\Activate.ps1
python -m uvicorn app.main:app --reload --port 8000
```

### Terminal 2 — Frontend

```powershell
cd "D:\Major Project\fraud-detection-gnn-main\frontend"
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# Model

The project uses a trained Graph Autoencoder model:

```text
models/gae_model.pt
```

The model works with the processed graph feature representation and generates embeddings used for similarity and anomaly analysis.

The current model uses **395 graph features** during inference.

---

# Data

The processed dataset contains healthcare beneficiary and claims information used to construct the graph and generate model features.

Important processed files include:

```text
data/processed/
├── claims_processed.csv
├── beneficiary_2008.csv
├── beneficiary_2010.csv
├── feature_columns.json
├── node_mapping.json
└── sample_test_cases.json
```

---

# Analysis Flow

```text
User enters claim information
            ↓
React frontend validates/submits data
            ↓
FastAPI API receives claim
            ↓
Claim converted into graph representation
            ↓
GNN / GAE generates embedding
            ↓
Embedding similarity calculated
            ↓
Anomaly score calculated
            ↓
Risk score and signals generated
            ↓
Results returned to frontend
            ↓
Risk dashboard + graph visualization
```

---

# Technologies Used

### Frontend

* React
* Vite
* JavaScript / JSX
* CSS

### Backend

* Python
* FastAPI
* Uvicorn
* PyTorch
* PyTorch Geometric

### Machine Learning

* Graph Neural Networks
* Graph Autoencoder (GAE)
* Graph embeddings
* Embedding similarity
* Anomaly detection

### Data Processing

* Pandas
* NumPy
* CSV-based healthcare claims data

---

# Project Status

The current implementation provides an end-to-end working pipeline:

```text
Frontend
   ↓
FastAPI
   ↓
Graph Construction
   ↓
GNN / GAE Inference
   ↓
Embedding + Anomaly Analysis
   ↓
Risk Results
   ↓
Frontend Visualization
```

The frontend is connected to the real backend inference API rather than being a standalone mock interface.

---

# License

This project is intended for academic and educational purposes.
