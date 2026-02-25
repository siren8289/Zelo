def ensure_dict(value) -> dict:
  if value is None:
    return {}
  if isinstance(value, dict):
    return value
  raise ValueError("expected dict")

