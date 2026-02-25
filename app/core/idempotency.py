import time
from dataclasses import dataclass

from fastapi import Header

from app.core.config import get_settings


@dataclass
class _Entry:
  expires_at: float
  response_json: dict


_CACHE: dict[str, _Entry] = {}


def _cleanup(now: float) -> None:
  dead = [k for k, v in _CACHE.items() if v.expires_at <= now]
  for k in dead:
    _CACHE.pop(k, None)


def get_idempotency_key(
  x_idempotency_key: str | None = Header(default=None),
) -> str | None:
  # Optional: clients may send it to make execute/save safe to retry
  return x_idempotency_key


def get_cached_response(key: str) -> dict | None:
  now = time.time()
  _cleanup(now)
  ent = _CACHE.get(key)
  if not ent:
    return None
  return ent.response_json


def store_cached_response(key: str, response_json: dict) -> None:
  settings = get_settings()
  now = time.time()
  _cleanup(now)
  _CACHE[key] = _Entry(expires_at=now + settings.idempotency_ttl_seconds, response_json=response_json)

