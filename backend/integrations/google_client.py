from __future__ import annotations

import json

from google.oauth2 import service_account
from googleapiclient.discovery import build

from backend.core.config import get_settings


class GoogleClient:
  def __init__(self):
    settings = get_settings()
    if not settings.google_service_account_json:
      raise RuntimeError("GOOGLE_SERVICE_ACCOUNT_JSON is not set")
    info = json.loads(settings.google_service_account_json)
    creds = service_account.Credentials.from_service_account_info(
      info,
      scopes=["https://www.googleapis.com/auth/calendar"],
    )
    self._svc = build("calendar", "v3", credentials=creds, cache_discovery=False)
    self._settings = settings

  def create_event(self, *, title: str, start_iso: str, end_iso: str, description: str | None = None, calendar_id: str | None = None) -> dict:
    cal_id = calendar_id or self._settings.google_calendar_id
    if not cal_id:
      raise RuntimeError("GOOGLE_CALENDAR_ID is not set")

    body = {
      "summary": title,
      "description": description or "",
      "start": {"dateTime": start_iso},
      "end": {"dateTime": end_iso},
    }
    return (
      self._svc.events()
      .insert(calendarId=cal_id, body=body)
      .execute()
    )
