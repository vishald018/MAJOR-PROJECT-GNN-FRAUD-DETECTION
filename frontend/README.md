# FraudDetect AI — Frontend

Independent React + Vite frontend for the AI-powered healthcare insurance
fraud detection platform. This is **frontend only** — no ML, no FastAPI, no
database logic. It runs entirely on a mock data layer until you wire it up
to your real backend.

## Stack

- React 19 + Vite
- React Router (three real routes, not one page pretending to be three)
- Tailwind CSS v4
- Lucide icons
- Hand-built SVG graph visualizations (no chart library dependency)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL and go to `/analyzer`.

```bash
npm run build   # production build, output in dist/
```

## Routes

| Route         | Page                                                    |
|---------------|----------------------------------------------------------|
| `/analyzer`   | Claim intake form + AI Risk Engine graph preview + CTA   |
| `/analyzing`  | Full-screen GNN processing animation with staged progress|
| `/results`    | Fraud Intelligence Dashboard with risk gauge, network graph, risk factors, model card, and signal bars |

State (the submitted claim, the claim ID, the analysis result) is shared
between these three separate routes via `src/context/ClaimContext.jsx`,
backed by `sessionStorage` so a refresh on `/results` doesn't lose your
place.

## Connecting your real backend

Everything the UI needs goes through **`src/services/api.js`** — the app
never imports the mock layer directly. Today it delegates to
`src/services/mockApi.js`, which fabricates a claim ID and a full analysis
payload with `setTimeout`-based delays.

To go live, replace the two functions in `src/services/api.js`:

```js
export async function submitClaim(formData) {
  const res = await fetch(`${BASE_URL}/claims`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  if (!res.ok) throw new Error('Failed to submit claim')
  return res.json() // must return { claimId }
}

export async function getAnalysisResult(claimId) {
  const res = await fetch(`${BASE_URL}/claims/${claimId}/analysis`)
  if (!res.ok) throw new Error('Failed to fetch analysis')
  return res.json()
}
```

Nothing in `pages/` or `components/` needs to change — they only know
about `submitClaim()` and `getAnalysisResult()`.

### Expected `getAnalysisResult` response shape

```jsonc
{
  "claimId": "CLM-...",
  "fraudScore": 78,               // 0-100
  "riskLevel": "HIGH",            // LOW | MEDIUM | HIGH
  "confidence": 94.7,             // %
  "inferenceTime": 1.8,           // seconds
  "riskFactors": [
    { "id": "provider_pattern", "title": "Provider Pattern", "description": "...", "severity": "high", "contribution": 0.41 }
  ],
  "signals": [
    { "id": "provider_anomaly", "label": "Provider anomaly", "active": true, "weight": 72 }
  ],
  "graph": {
    "nodes": [{ "id": "beneficiary", "label": "Beneficiary", "type": "beneficiary" }],
    "edges": [{ "source": "beneficiary", "target": "provider", "weight": 0.8 }]
  },
  "model": {
    "name": "Graph Neural Network",
    "variants": ["GAT", "GCN", "GIN"],
    "features": "Beneficiary + Provider + Claim + Payment",
    "detection": "Anomaly + Risk Classification",
    "inference": "Real-Time"
  }
}
```

## Project structure

```
src/
  components/
    layout/        Navbar
    common/         MetricCard, SectionLabel, Field (Text/Select inputs)
    analyzer/       ClaimForm, FormSection, ConditionCard, PaymentSection,
                    RiskEngine, GraphVisualization
    analyzing/      AnalysisLoader, AnalysisGraph
    results/        RiskGauge, RiskSummary, RiskFactorCard,
                    ModelIntelligence, RiskSignals, ClaimNetworkGraph
  context/          ClaimContext.jsx (cross-route state)
  data/             formOptions.js (dropdown option lists)
  services/         api.js (public API), mockApi.js (fake backend)
  pages/            Analyzer.jsx, Analyzing.jsx, Results.jsx
  App.jsx           Route definitions
  main.jsx          Entry point
```

## Design tokens

| Token    | Hex       |
|----------|-----------|
| void     | `#030712` |
| abyss    | `#07152B` |
| deep     | `#0B1F3A` |
| panel    | `#10233D` |
| accent   | `#2563EB` |
| cyan     | `#06B6D4` |
| danger   | `#EF4444` |
| warning  | `#F59E0B` |
| success  | `#22C55E` |

Fonts: Manrope (display/headings) and Plus Jakarta Sans (body), loaded via
Google Fonts in `src/index.css`.
