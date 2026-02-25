from app.tools.base import BaseTool
from app.integrations.notion_client import NotionClient


class NotionPageTool(BaseTool):
  name = "notion_page"

  def preview(self, payload: dict) -> tuple[str, list[dict]]:
    title = payload.get("title") or "(no title)"
    return (f"Notion 페이지 생성: {title}", [{"action": "notion.create_page", "payload": payload}])

  def execute(self, payload: dict) -> dict:
    title = payload.get("title") or "Untitled"
    content = payload.get("content") or ""
    parent_page_id = payload.get("parent_page_id")
    notion = NotionClient()
    page = notion.create_page(title=title, content=content, parent_page_id=parent_page_id)
    return {"provider": "notion", "action": "create_page", "id": page.get("id"), "url": page.get("url")}

