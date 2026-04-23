from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class Medication(BaseModel):
    name: str
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    duration: Optional[str] = None


class EvidenceSnippets(BaseModel):
    chief_complaints: Optional[str] = None
    diagnosis: Optional[str] = None
    medications: Optional[str] = None
    advice: Optional[str] = None


class PrescriptionOutput(BaseModel):
    chief_complaints: list[str] = []
    diagnosis: Optional[str] = None
    medications: list[Medication] = []
    lab_tests: list[str] = []
    radiology_tests: list[str] = []
    advice: list[str] = []
    confidence_score: float = 0.0
    evidence_snippets: EvidenceSnippets = EvidenceSnippets()


class PrescriptionRequest(BaseModel):
    text: str


class PrescriptionRecord(BaseModel):
    id: str
    raw_text: str
    structured_output: PrescriptionOutput
    created_at: datetime
    model_used: str = "gpt-4o"