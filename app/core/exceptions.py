from fastapi import HTTPException, status


class ApprovalRequired(HTTPException):
  def __init__(self, detail: str = "approval required"):
    super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


class Unauthorized(HTTPException):
  def __init__(self, detail: str = "unauthorized"):
    super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)

