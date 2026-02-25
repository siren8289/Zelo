from __future__ import annotations

from notion_client import Client as NotionSDK

from backend.core.config import get_settings


class NotionClient:
  def __init__(self):
    settings = get_settings()
    if not settings.notion_token:
      raise RuntimeError("NOTION_TOKEN is not set")
    self._sdk = NotionSDK(auth=settings.notion_token)
    self._settings = settings

  def create_page(self, *, title: str, content: str, parent_page_id: str | None = None) -> dict:
    parent_id = parent_page_id or self._settings.notion_parent_page_id
    db_id = self._settings.notion_database_id

    children = _text_to_blocks(content)

    if parent_id:
      return self._sdk.pages.create(
        parent={"page_id": parent_id},
        properties={"title": {"title": [{"text": {"content": title}}]}},
        children=children,
      )

    if db_id:
      # Create in database (must have a title property named "Name" or configure in payload in the future)
      return self._sdk.pages.create(
        parent={"database_id": db_id},
        properties={"Name": {"title": [{"text": {"content": title}}]}},
        children=children,
      )

    raise RuntimeError("Set NOTION_PARENT_PAGE_ID or NOTION_DATABASE_ID to create pages")

  def create_db_row(self, *, database_id: str, properties: dict) -> dict:
    return self._sdk.pages.create(parent={"database_id": database_id}, properties=properties)


def _text_to_blocks(text: str) -> list[dict]:
  lines = [ln.rstrip() for ln in (text or "").splitlines()]
  blocks: list[dict] = []
  for ln in lines:
    if not ln.strip():
      continue
    blocks.append(
      {
        "object": "block",
        "type": "paragraph",
        "paragraph": {"rich_text": [{"type": "text", "text": {"content": ln}}]},
      }
    )
  return blocks

