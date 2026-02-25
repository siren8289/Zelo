from fastapi import APIRouter, Depends

from app.api.deps import ApiKeyDep
from app.schemas.response import LogsResponse
from app.services.log_service import list_logs

router = APIRouter()


@router.get("/logs", response_model=LogsResponse, dependencies=[ApiKeyDep])
def get_logs() -> LogsResponse:
  return LogsResponse(items=list_logs())

