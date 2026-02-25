import time

from backend.schemas.response import LogItem

_LOGS: list[LogItem] = []


def add_log(level: str, message: str, context: dict | None = None) -> None:
  _LOGS.append(LogItem(ts=time.time(), level=level.upper(), message=message, context=context))
  # keep last 500
  if len(_LOGS) > 500:
    del _LOGS[: len(_LOGS) - 500]


def list_logs() -> list[LogItem]:
  return list(reversed(_LOGS))

