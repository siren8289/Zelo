import time
from collections.abc import Callable


def with_backoff(fn: Callable[[], object], retries: int = 3, base_sleep: float = 0.25):
  last_err: Exception | None = None
  for i in range(retries):
    try:
      return fn()
    except Exception as e:  # noqa: BLE001
      last_err = e
      time.sleep(base_sleep * (2**i))
  if last_err:
    raise last_err
  raise RuntimeError("retry failed")

