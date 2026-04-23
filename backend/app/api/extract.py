import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from app.models.prescription import PrescriptionRequest, PrescriptionRecord
from app.services.extractor import extract_prescription
from app.services.database import get_database

router = APIRouter()


@router.post("/extract")
async def extract(request: PrescriptionRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    structured = await extract_prescription(request.text)

    record = {
        "id": str(uuid.uuid4()),
        "raw_text": request.text,
        "structured_output": structured.model_dump(),
        "created_at": datetime.now(timezone.utc),
        "model_used": "gpt-4o",
    }

    db = get_database()
    await db.extractions.insert_one(record)
    record.pop("_id", None)

    return record


@router.get("/history")
async def get_history():
    db = get_database()
    cursor = db.extractions.find({}, {"_id": 0}).sort("created_at", -1).limit(20)
    records = await cursor.to_list(length=20)
    return records


@router.get("/history/{record_id}")
async def get_record(record_id: str):
    db = get_database()
    record = await db.extractions.find_one({"id": record_id}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
    return record