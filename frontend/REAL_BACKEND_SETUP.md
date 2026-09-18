# Real backend integration

This frontend calls the existing FastAPI backend instead of mock data.

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

Optional `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Backend compatibility files

Copy these two files from the integration bundle over the originals:

- `backend/app/api.py`
- `backend/app/inference.py`

The inference implementation aligns a new claim with the exact 395-dimensional feature layout saved in `data/processed/feature_columns.json` and uses the same payment normalization statistics as graph construction.

The API also creates `data/processed/claim_graph_data.pt` automatically on first startup if the graph artifact is missing.

## Start backend

From the project root:

```powershell
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

Then open the frontend at the Vite URL.

The default Provider ID in the form is `4900NA`, which exists in the supplied node mapping. New submissions require a provider ID that exists in `data/processed/node_mapping.json`.
