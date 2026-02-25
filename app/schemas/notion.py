from pydantic import BaseModel


class NotionPageCreate(BaseModel):
  title: str
  content: str

