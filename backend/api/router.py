from fastapi import APIRouter

from backend.api.routes.execute import router as execute_router
from backend.api.routes.logs import router as logs_router
from backend.api.routes.preview import router as preview_router
from backend.api.routes.rollback import router as rollback_router

api_router = APIRouter(prefix="/api")

api_router.include_router(preview_router, tags=["preview"])
api_router.include_router(execute_router, tags=["execute"])
api_router.include_router(rollback_router, tags=["rollback"])
api_router.include_router(logs_router, tags=["logs"])

