from fastapi import Depends, Header

from app.core.idempotency import get_idempotency_key
from app.core.security import require_api_key
from app.services.approval_service import require_approval


def common_deps():
  # placeholder for shared deps
  return True


ApiKeyDep = Depends(require_api_key)
IdempotencyDep = Depends(get_idempotency_key)


def ApprovalDep(x_approved: str | None = Header(default=None)) -> None:
  return require_approval(x_approved)

