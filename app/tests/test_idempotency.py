from fastapi.testclient import TestClient

from app.main import create_app


def test_idempotency_cache():
  app = create_app()
  client = TestClient(app)

  headers = {"X-Approved": "true", "X-Idempotency-Key": "k1"}
  r1 = client.post("/api/execute", headers=headers, json={"tool": "notion_page", "payload": {"title": "t"}, "dry_run": True})
  assert r1.status_code == 200
  r2 = client.post("/api/execute", headers=headers, json={"tool": "notion_page", "payload": {"title": "t"}, "dry_run": True})
  assert r2.status_code == 200
  assert r1.json() == r2.json()

