from fastapi import FastAPI

from app.api.router import api_router
from app.core.logging import configure_logging
from app.middleware.error_handler import register_error_handlers
from app.middleware.request_logger import register_request_logger


def create_app() -> FastAPI:
  configure_logging()
  app = FastAPI(title="AI Agent Backend", version="0.1.0")

  register_request_logger(app)
  register_error_handlers(app)

  app.include_router(api_router)
  return app


app = create_app()

