from fastapi import APIRouter, Depends

from backend.api.deps import ApiKeyDep
from backend.schemas.execution import PreviewRequest, PreviewResponse
from backend.services.execution_service import build_preview

router = APIRouter()


@router.post("/preview", response_model=PreviewResponse, dependencies=[ApiKeyDep])
def preview(req: PreviewRequest) -> PreviewResponse:
  return build_preview(req)

