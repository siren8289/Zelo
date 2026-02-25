from backend.tools.base import BaseTool
from backend.integrations.notion_client import NotionClient


class NotionDbTool(BaseTool):
  name = "notion_db"

  def preview(self, payload: dict) -> tuple[str, list[dict]]:
    return ("Notion DB 작업", [{"action": "notion.db", "payload": payload}])

  def execute(self, payload: dict) -> dict:
    database_id = payload.get("database_id")
    properties = payload.get("properties") or {}
    if not database_id:
      raise RuntimeError("payload.database_id is required")
    notion = NotionClient()
    page = notion.create_db_row(database_id=database_id, properties=properties)
    return {"provider": "notion", "action": "db_insert", "id": page.get("id"), "url": page.get("url")}

