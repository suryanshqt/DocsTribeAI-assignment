import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv
from app.core.prompt import EXTRACTION_PROMPT
from app.models.prescription import PrescriptionOutput

load_dotenv()

openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))


async def extract_prescription(raw_text: str) -> PrescriptionOutput:
    response = await openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": EXTRACTION_PROMPT},
            {"role": "user", "content": f"Extract structured information from this prescription:\n\n{raw_text}"},
        ],
        response_format={"type": "json_object"},
        temperature=0,
    )

    raw_json = response.choices[0].message.content
    data = json.loads(raw_json)
    return PrescriptionOutput(**data)