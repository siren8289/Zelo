from pydantic import BaseModel


class CalendarEventCreate(BaseModel):
  title: str
  start_iso: str
  end_iso: str

