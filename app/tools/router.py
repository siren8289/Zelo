from fastapi import HTTPException, status

from app.tools.base import BaseTool
from app.tools.calendar_tool import CalendarTool
from app.tools.notion_db_tool import NotionDbTool
from app.tools.notion_page_tool import NotionPageTool


class ToolRouter:
  def __init__(self, tools: list[BaseTool]):
    self._tools = {t.name: t for t in tools}

  def get(self, name: str) -> BaseTool:
    tool = self._tools.get(name)
    if not tool:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"unknown tool: {name}",
      )
    return tool


tool_router = ToolRouter([NotionPageTool(), NotionDbTool(), CalendarTool()])

