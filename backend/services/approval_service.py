from backend.core.exceptions import ApprovalRequired


def require_approval(x_approved: str | None) -> None:
  # Minimal approval gate: require header X-Approved: true
  if (x_approved or "").strip().lower() not in {"true", "1", "yes"}:
    raise ApprovalRequired("set X-Approved: true to execute/rollback")

