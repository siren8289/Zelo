export function buildOrganizePrompt(raw: string) {
  return `
너는 할 일 정리 엔진이다.
반드시 "유효한 JSON"만 출력한다. 마크다운/설명/코드블록 금지.

규칙:
- 문장에 여러 행동이 있으면 쪼개서 각각 item으로 만든다.
- 중복은 합친다.
- content는 "동사 + 대상" 형태로 정규화한다.
- category는 다음 중 하나:
  ["업무","학업","개발","디자인","문서","회의","연락","개인","기타"]
- status: ["not_started","in_progress","blocked","done"]
- estimated_time: ["5m","15m","30m","1h","2h","3h+","unknown"]
- 마감/급함/조건 등은 notes에 짧게 기록한다.
- item 개수는 3~30개. 너무 많으면 중요한 것 위주.

스키마:
{
  "raw_input": string,
  "items": [
    { "category": string, "content": string, "status": string, "estimated_time": string, "notes": string|null }
  ]
}

입력(raw todos):
${raw}
`.trim();
}

export function buildPriorityPrompt(organizedJson: string) {
  return `
너는 우선순위 산정 엔진이다.
반드시 "유효한 JSON"만 출력한다. 마크다운/설명 금지.

채점(0~100):
- Impact(0~40), Urgency(0~30), Effort(0~20: 짧을수록↑), Dependency(0~10: 막힌거 풀면↑)

규칙:
- organized.items의 순서를 item_index로 고정해서 매핑한다.
- priority_score는 정수 0~100
- reason은 한국어 1문장, 120자 이내
- ordered_indexes는 priority_score 내림차순 정렬된 item_index 배열

스키마:
{
  "items": [
    { "item_index": number, "priority_score": number, "reason": string }
  ],
  "ordered_indexes": number[]
}

입력(JSON):
${organizedJson}
`.trim();
}
