from __future__ import annotations

from supabase import create_client

from backend.core.config import get_settings


class SupabaseClient:
  def __init__(self):
    settings = get_settings()
    if not settings.supabase_url or not settings.supabase_service_key:
      raise RuntimeError("SUPABASE_URL / SUPABASE_SERVICE_KEY are not set")
    self._sb = create_client(settings.supabase_url, settings.supabase_service_key)

  @property
  def client(self):
    return self._sb

