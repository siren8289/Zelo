from fastapi import APIRouter, Depends

from app.api.deps import ApiKeyDep, ApprovalDep
from app.schemas.execution import RollbackRequest, RollbackResponse
from app.services.execution_service import rollback_action

router = APIRouter()


@router.post("/rollback", response_model=RollbackResponse, dependencies=[ApiKeyDep])
def rollback(req: RollbackRequest, _approval: None = Depends(ApprovalDep)) -> RollbackResponse:
  return rollback_action(req)

