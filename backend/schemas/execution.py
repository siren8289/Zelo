from pydantic import BaseModel, Field


class PreviewRequest(BaseModel):
  tool: str = Field(..., examples=["notion_page", "calendar_event"])
  payload: dict = Field(default_factory=dict)


class PreviewResponse(BaseModel):
  ok: bool = True
  summary: str
  actions: list[dict] = Field(default_factory=list)


class ExecuteRequest(BaseModel):
  tool: str
  payload: dict = Field(default_factory=dict)
  dry_run: bool = False


class ExecuteResponse(BaseModel):
  ok: bool
  result: dict | None = None
  message: str | None = None


class RollbackRequest(BaseModel):
  execution_id: str


class RollbackResponse(BaseModel):
  ok: bool
  message: str

from pydantic import BaseModel, Field


class PreviewRequest(BaseModel):
  tool: str = Field(..., examples=["notion_page", "calendar_event"])
  payload: dict = Field(default_factory=dict)


class PreviewResponse(BaseModel):
  ok: bool = True
  summary: str
  actions: list[dict] = Field(default_factory=list)


class ExecuteRequest(BaseModel):
  tool: str
  payload: dict = Field(default_factory=dict)
  dry_run: bool = False


class ExecuteResponse(BaseModel):
  ok: bool
  result: dict | None = None
  message: str | None = None


class RollbackRequest(BaseModel):
  execution_id: str


class RollbackResponse(BaseModel):
  ok: bool
  message: str

