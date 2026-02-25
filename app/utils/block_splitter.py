def split_blocks(text: str) -> list[str]:
  return [b.strip() for b in text.split("\n\n") if b.strip()]

