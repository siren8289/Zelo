## FastAPI backend (backend/)

This repository includes a minimal FastAPI backend under `backend/` with layered architecture:

- `backend/main.py`: FastAPI entrypoint
- `backend/api/`: routers + deps
- `backend/services/`: business logic
- `backend/tools/`: external-action layer (tool router)
- `backend/middleware/`: request logging + error handling
- `backend/tests/`: minimal pytest suite

### Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

uvicorn backend.main:app --reload --port 8000
```

### Endpoints

- `POST /api/preview`
- `POST /api/execute` (requires header `X-Approved: true`)
- `POST /api/rollback` (requires header `X-Approved: true`)
- `GET /api/logs`

### Tests

```bash
pytest -q
```

