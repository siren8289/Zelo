from fastapi import APIRouter, Depends

from app.api.deps import ApiKeyDep, ApprovalDep, IdempotencyDep
from app.core.idempotency import get_cached_response, store_cached_response
from app.schemas.execution import ExecuteRequest, ExecuteResponse
from app.services.execution_service import execute_action

router = APIRouter()


@router.post("/execute", response_model=ExecuteResponse, dependencies=[ApiKeyDep])
def execute(
  req: ExecuteRequest,
  _approval: None = Depends(ApprovalDep),
  idem_key: str | None = IdempotencyDep,
) -> ExecuteResponse:
  if idem_key:
    cached = get_cached_response(idem_key)
    if cached:
      return ExecuteResponse.model_validate(cached)

  res = execute_action(req)
  if idem_key:
    store_cached_response(idem_key, res.model_dump())
  return res

