from fastapi import APIRouter, Depends

from app.api.deps import ApiKeyDep
from app.schemas.execution import PreviewRequest, PreviewResponse
from app.services.execution_service import build_preview

router = APIRouter()


@router.post("/preview", response_model=PreviewResponse, dependencies=[ApiKeyDep])
def preview(req: PreviewRequest) -> PreviewResponse:
  return build_preview(req)

