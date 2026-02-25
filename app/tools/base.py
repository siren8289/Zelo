from __future__ import annotations

from abc import ABC, abstractmethod


class BaseTool(ABC):
  name: str

  @abstractmethod
  def preview(self, payload: dict) -> tuple[str, list[dict]]:
    raise NotImplementedError

  @abstractmethod
  def execute(self, payload: dict) -> dict:
    raise NotImplementedError

