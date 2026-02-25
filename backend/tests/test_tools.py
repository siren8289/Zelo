from backend.tools.router import tool_router


def test_tool_router_known_tool():
  tool = tool_router.get("notion_page")
  summary, actions = tool.preview({"title": "hello", "content": "world"})
  assert "Notion" in summary
  assert actions

