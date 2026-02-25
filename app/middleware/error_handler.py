import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


logger = logging.getLogger("app.error_handler")


def register_error_handlers(app: FastAPI) -> None:
  @app.exception_handler(Exception)
  async def _unhandled(request: Request, exc: Exception):  # noqa: BLE001
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"error": "internal_server_error"})

