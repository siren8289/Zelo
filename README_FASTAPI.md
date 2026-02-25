## FastAPI backend (app/)

This repository includes a minimal FastAPI backend under `app/` with layered architecture:

- `app/main.py`: FastAPI entrypoint
- `app/api/`: routers + deps
- `app/services/`: business logic
- `app/tools/`: external-action layer (tool router)
- `app/middleware/`: request logging + error handling
- `app/tests/`: minimal pytest suite

### Run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
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

