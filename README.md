# Prescription Structurer

AI-powered clinical note parser — built for the DocsTribeAI Engineering Assignment.

A full-stack application that accepts raw prescription or doctor note text and returns clean, validated, structured JSON using GPT-4o. Built with Next.js, FastAPI, MongoDB Atlas, and deployed on Vercel + Railway.

---

## Live Demo

| | Link |
|---|---|
| Frontend | https://docs-tribe-ai-assignment.vercel.app |
| Backend API | https://docstribeai-assignment-production.up.railway.app/docs |
| GitHub | https://github.com/suryanshqt/DocsTribeAI-assignment |

---

## Features

- Accepts raw prescriptions, doctor notes, and heavily abbreviated clinical text
- Extracts: chief complaints, diagnosis, medications, lab tests, radiology tests, advice
- Medication details: name, dosage, frequency, duration
- Expands medical shorthand — OD, BD, TDS, QID, SOS, PRN, HS, AC, PC, and more
- Returns `null` / `[]` for missing fields — never guesses
- Confidence score reflecting extraction certainty
- Evidence snippets — exact source phrases from the input
- Saves every extraction to MongoDB Atlas with a unique record ID
- Interactive API docs at `/docs`

---

## Project Structure

```
DocsTribeAI-assignment/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── extract.py        # POST /api/extract endpoint
│   │   ├── core/
│   │   │   └── prompt.py         # GPT-4o system prompt
│   │   ├── models/
│   │   │   └── prescription.py   # Pydantic request/response models
│   │   ├── services/
│   │   │   ├── extractor.py      # OpenAI API call + JSON parsing
│   │   │   └── database.py       # MongoDB Atlas connection (motor)
│   │   └── main.py               # FastAPI app + CORS + lifespan
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── app/
│   │   ├── page.tsx              # Main extraction UI
│   │   └── layout.tsx
│   ├── components/
│   │   ├── input-section.tsx     # Text input + sample prescriptions
│   │   └── results-section.tsx   # Structured output display
│   ├── .env.local.example
│   └── Dockerfile
└── docker-compose.yml
```

---

## Setup & Running

### Option 1 — Local Development

#### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Fill in your API keys
uvicorn app.main:app --reload --port 8000
```

#### Frontend

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

### Option 2 — Docker

```bash
git clone https://github.com/suryanshqt/DocsTribeAI-assignment.git
cd DocsTribeAI-assignment
cp backend/.env.example backend/.env
# Fill in OPENAI_API_KEY and MONGODB_URI in backend/.env
docker-compose up --build
```

---

## Environment Variables

### `backend/.env`

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `DB_NAME` | Database name (default: `prescription_db`) |
| `APP_ENV` | `development` or `production` |

### `frontend/.env.local`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (default: `http://localhost:8000`) |

---

## API Reference

### `POST /api/extract`

Extracts structured data from raw prescription text.

**Request**
```json
{
  "text": "Pt c/o fever x3d, sore throat. Dx: Viral pharyngitis. Tab Paracetamol 500mg TDS x5d. CBC. Adv: rest, fluids. F/U 5d."
}
```

**Response**
```json
{
  "id": "ec62f4f7-5beb-491b-aead-5370e51fcb52",
  "model_used": "gpt-4o",
  "created_at": "2026-04-24T00:00:00Z",
  "structured_output": {
    "chief_complaints": ["fever for 3 days", "sore throat"],
    "diagnosis": "Viral pharyngitis",
    "medications": [
      {
        "name": "Paracetamol",
        "dosage": "500mg",
        "frequency": "three times daily",
        "duration": "5 days"
      }
    ],
    "lab_tests": ["Complete Blood Count"],
    "radiology_tests": [],
    "advice": ["rest", "fluids", "follow up in 5 days"],
    "confidence_score": 0.92,
    "evidence_snippets": {
      "chief_complaints": "c/o fever x3d, sore throat",
      "diagnosis": "Dx: Viral pharyngitis",
      "medications": "Tab Paracetamol 500mg TDS x5d",
      "advice": "Adv: rest, fluids. F/U 5d"
    }
  }
}
```

### `GET /api/history`

Returns the last 20 extractions.

### `GET /api/history/{record_id}`

Returns a specific extraction by ID.

---

## Approach, Prompt Design & Tradeoffs

### Prompt Design

The GPT-4o system prompt is designed around four principles:

**1. Strict JSON output** — The model is instructed to return only valid JSON with no prose or markdown. `response_format: json_object` is enforced at the API level as a secondary guarantee.

**2. No hallucination policy** — Every field has an explicit instruction: return `null` for missing scalar fields and `[]` for missing lists. The model is never allowed to infer or guess.

**3. Shorthand dictionary** — The prompt includes a built-in expansion table covering the most common medical abbreviations: OD (once daily), BD (twice daily), TDS (three times daily), QID (four times daily), SOS/PRN (as needed), HS (at bedtime), AC (before meals), PC (after meals), Tab (Tablet), Cap (Capsule), and 20+ more.

**4. Evidence snippets** — The model is asked to quote the exact substring from the input that led to each extraction. This improves explainability and lets the UI show the source of every field.

### Structured Output Handling

- OpenAI `response_format: json_object` prevents markdown-wrapped responses
- `json.loads()` inside a try/except catches any edge cases
- Pydantic models validate the parsed JSON — field types, optional fields, and nested structures are all enforced before the response is returned

### Error Handling

| Scenario | Response |
|---|---|
| Empty input | 400 Bad Request |
| LLM returns invalid JSON | 422 Unprocessable Entity |
| OpenAI API error | 503 with detail message |
| Record not found | 404 Not Found |

### Tradeoffs

| Decision | Reasoning | Tradeoff |
|---|---|---|
| Single LLM call | Faster, cheaper, simpler | Harder to retry one failed field without re-running everything |
| Pydantic validation | Catches bad output early, clean error messages | Strict typing may reject unusual but valid responses |
| Evidence snippets | Improves explainability and trust | Increases prompt length and token cost |
| Confidence score | Useful soft signal for downstream use | Self-reported by the model — not statistically calibrated |
| MongoDB Atlas | Schema-flexible, no migrations, free tier | Slight latency vs local; requires network access |
| GPT-4o | Best-in-class for structured medical extraction | Cost — could use GPT-4o-mini for lower stakes use cases |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | Python 3.11, FastAPI |
| AI Model | GPT-4o (OpenAI) |
| Database | MongoDB Atlas (motor async driver) |
| Deployment | Vercel (frontend) + Railway (backend) |
| Containerization | Docker, Docker Compose |

---

## Assignment Checklist

- [x] Accept raw prescription text from frontend
- [x] Send to Python backend API
- [x] Analyze using LLM (GPT-4o)
- [x] Return clean structured JSON
- [x] Display extracted information on frontend
- [x] chief_complaints, diagnosis, medications, lab_tests, radiology_tests, advice
- [x] Medication: name, dosage, frequency, duration
- [x] Clean API design with validation and error handling
- [x] Good prompt design for structured extraction
- [x] Strict JSON response handling
- [x] No guessing — null/empty for missing fields
- [x] Confidence score (bonus)
- [x] Evidence snippets (bonus)
- [x] Shorthand handling — OD, BD, TDS, SOS, PRN etc. (bonus)
- [x] Deployment link (bonus)
- [x] Docker setup (bonus)

---

## Author

Suryansh Gupta
