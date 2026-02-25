from fastapi import HTTPException, status

from backend.tools.base import BaseTool
from backend.tools.calendar_tool import CalendarTool
from backend.tools.notion_db_tool import NotionDbTool
from backend.tools.notion_page_tool import NotionPageTool


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

