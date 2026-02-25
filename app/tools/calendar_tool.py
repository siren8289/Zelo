from app.tools.base import BaseTool
from app.integrations.google_client import GoogleClient


class CalendarTool(BaseTool):
  name = "calendar_event"

  def preview(self, payload: dict) -> tuple[str, list[dict]]:
    title = payload.get("title") or "(no title)"
    return (f"캘린더 이벤트 생성: {title}", [{"action": "calendar.create_event", "payload": payload}])

  def execute(self, payload: dict) -> dict:
    title = payload.get("title") or "Untitled"
    start_iso = payload.get("start_iso")
    end_iso = payload.get("end_iso")
    description = payload.get("description")
    calendar_id = payload.get("calendar_id")
    if not start_iso or not end_iso:
      raise RuntimeError("start_iso and end_iso are required")
    g = GoogleClient()
    ev = g.create_event(
      title=title,
      start_iso=start_iso,
      end_iso=end_iso,
      description=description,
      calendar_id=calendar_id,
    )
    return {"provider": "google_calendar", "action": "create_event", "id": ev.get("id"), "htmlLink": ev.get("htmlLink")}

