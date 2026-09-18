from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import router

app = FastAPI()

# Allow frontend (adjust if needed)
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:5174",  # Vite dev server (alternative port)
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:5175",# Vite dev server (alternative port)

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
