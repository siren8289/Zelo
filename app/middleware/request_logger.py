import time
import uuid

from fastapi import FastAPI, Request

from app.services.log_service import add_log


def register_request_logger(app: FastAPI) -> None:
  @app.middleware("http")
  async def _logger(request: Request, call_next):
    rid = request.headers.get("x-request-id") or str(uuid.uuid4())
    start = time.time()
    response = await call_next(request)
    elapsed_ms = int((time.time() - start) * 1000)
    response.headers["x-request-id"] = rid
    add_log(
      "INFO",
      "request",
      {"method": request.method, "path": request.url.path, "status": response.status_code, "ms": elapsed_ms},
    )
    return response

