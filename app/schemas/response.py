from pydantic import BaseModel


class ErrorResponse(BaseModel):
  error: str


class LogItem(BaseModel):
  ts: float
  level: str
  message: str
  context: dict | None = None


class LogsResponse(BaseModel):
  items: list[LogItem]

