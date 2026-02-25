from fastapi import APIRouter, Depends

from backend.api.deps import ApiKeyDep, ApprovalDep
from backend.schemas.execution import RollbackRequest, RollbackResponse
from backend.services.execution_service import rollback_action

router = APIRouter()


@router.post("/rollback", response_model=RollbackResponse, dependencies=[ApiKeyDep])
def rollback(req: RollbackRequest, _approval: None = Depends(ApprovalDep)) -> RollbackResponse:
  return rollback_action(req)

