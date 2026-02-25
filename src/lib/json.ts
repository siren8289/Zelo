/**
 * AI 응답에서 첫 번째 완전한 JSON 객체만 추출해 파싱.
 * (설명문, 마크다운, 여러 객체가 붙어 있을 때도 동작)
 */
export function safeJsonParse<T>(text: string): T {
  const trimmed = text.trim();
  const first = trimmed.indexOf("{");
  if (first < 0) {
    return JSON.parse(trimmed) as T;
  }
  let depth = 0;
  let end = -1;
  for (let i = first; i < trimmed.length; i++) {
    const c = trimmed[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  const candidate = end >= 0 ? trimmed.slice(first, end + 1) : trimmed.slice(first);
  return JSON.parse(candidate) as T;
}
