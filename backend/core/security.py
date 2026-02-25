from fastapi import Header

from backend.core.config import get_settings
from backend.core.exceptions import Unauthorized


def require_api_key(x_api_key: str | None = Header(default=None)) -> None:
  settings = get_settings()
  if settings.api_key:
    if not x_api_key or x_api_key != settings.api_key:
      raise Unauthorized("invalid api key")

