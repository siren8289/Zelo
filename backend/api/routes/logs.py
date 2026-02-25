from fastapi import APIRouter, Depends

from backend.api.deps import ApiKeyDep
from backend.schemas.response import LogsResponse
from backend.services.log_service import list_logs

router = APIRouter()


@router.get("/logs", response_model=LogsResponse, dependencies=[ApiKeyDep])
def get_logs() -> LogsResponse:
  return LogsResponse(items=list_logs())

