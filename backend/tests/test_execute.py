from fastapi.testclient import TestClient

from backend.main import create_app


def test_preview_execute_roundtrip():
  app = create_app()
  client = TestClient(app)

  # preview doesn't require approval
  r = client.post("/api/preview", json={"tool": "notion_page", "payload": {"title": "t", "content": "c"}})
  assert r.status_code == 200
  assert r.json()["ok"] is True

  # execute requires X-Approved
  r2 = client.post("/api/execute", json={"tool": "notion_page", "payload": {"title": "t", "content": "c"}})
  assert r2.status_code == 403

  r3 = client.post(
    "/api/execute",
    headers={"X-Approved": "true"},
    json={"tool": "notion_page", "payload": {"title": "t", "content": "c"}, "dry_run": True},
  )
  assert r3.status_code == 200
  assert r3.json()["ok"] is True

