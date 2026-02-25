from backend.schemas.execution import (
  ExecuteRequest,
  ExecuteResponse,
  PreviewRequest,
  PreviewResponse,
  RollbackRequest,
  RollbackResponse,
)
from backend.services.log_service import add_log
from backend.tools.router import tool_router


def build_preview(req: PreviewRequest) -> PreviewResponse:
  tool = tool_router.get(req.tool)
  summary, actions = tool.preview(req.payload)
  return PreviewResponse(summary=summary, actions=actions)


def execute_action(req: ExecuteRequest) -> ExecuteResponse:
  tool = tool_router.get(req.tool)
  add_log("INFO", "execute requested", {"tool": req.tool, "dry_run": req.dry_run})
  if req.dry_run:
    summary, actions = tool.preview(req.payload)
    return ExecuteResponse(ok=True, result={"preview": {"summary": summary, "actions": actions}})
  result = tool.execute(req.payload)
  add_log("INFO", "execute completed", {"tool": req.tool})
  return ExecuteResponse(ok=True, result=result)


def rollback_action(req: RollbackRequest) -> RollbackResponse:
  # Minimal placeholder: in real implementation, map execution_id -> compensating action
  add_log("WARN", "rollback requested", {"execution_id": req.execution_id})
  return RollbackResponse(ok=True, message=f"rollback queued for {req.execution_id}")

