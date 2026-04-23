from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.extract import router as extract_router
from app.services.database import close_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[Prescription Structurer] Starting Up")
    yield
    print("[Prescription Structurer] Shutting Down")
    await close_client()


app = FastAPI(
    title="Prescription Structurer API",
    description="Assignment Submission — DocStribe AI Internship 2026 | Suryansh Gupta\n\nExtracts structured medical data from raw prescriptions and doctor notes using GPT-4o. Handles complex shorthand, abbreviations, and incomplete clinical text — returning clean JSON with medications, diagnoses, lab tests, radiology orders, advice, confidence scores, and evidence snippets.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(extract_router, prefix="/api")