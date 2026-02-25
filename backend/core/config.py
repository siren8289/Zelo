from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
  model_config = SettingsConfigDict(env_file=".env", extra="ignore")

  # Basic security
  api_key: str | None = None  # if set, require X-API-Key

  # Idempotency
  idempotency_ttl_seconds: int = 60 * 10

  # Logging
  log_level: str = "INFO"

  # Notion
  notion_token: str | None = None
  notion_parent_page_id: str | None = None
  notion_database_id: str | None = None

  # Google Calendar (Service Account)
  google_service_account_json: str | None = None  # JSON string
  google_calendar_id: str | None = None

  # Supabase (optional for this FastAPI backend)
  supabase_url: str | None = None
  supabase_service_key: str | None = None


def get_settings() -> Settings:
  return Settings()

