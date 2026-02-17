export interface HistoryItem {
  id: string;
  type: "planner" | "tasks";
  title: string;
  date: string;
  preview: string;
}

export function getMockPlannerData(item: HistoryItem) {
  return {
    id: item.id,
    title: item.title,
    date: item.date,
    structuredData: {
      goal:
        "직장인들에게 건강하고 영양가 있는 식사를 정기적으로 제공하여 바쁜 일상 속에서도 건강한 식습관을 유지할 수 있도록 돕는다.",
      target:
        "20-40대 직장인, 특히 점심시간이 짧거나 불규칙한 식사를 하는 사람들. 건강에 관심이 많지만 요리할 시간이 부족한 1인 가구.",
      problem:
        "직장인들은 바쁜 일정으로 인해 배달음식이나 편의점 도시락에 의존하게 되며, 이는 영양 불균형과 건강 문제로 이어진다.",
      solution:
        "영양사가 설계한 균형 잡힌 식단을 정기 구독 형태로 제공하고, 개인의 건강 목표와 선호도에 따라 커스터마이징할 수 있는 시스템을 구축한다.",
    },
  };
}

export function getMockTasksData(item: HistoryItem) {
  return {
    id: item.id,
    title: item.title,
    date: item.date,
    tasks: [
      {
        id: "1",
        title: "사용자 로그인 API 개발",
        category: "개발",
        priority: 95,
        urgency: "긴급",
        reason: "프로젝트 핵심 기능이며 다른 작업의 선행 조건",
        completed: false,
      },
      {
        id: "2",
        title: "디자인 시스템 컴포넌트 정리",
        category: "디자인",
        priority: 75,
        urgency: "중요",
        reason: "일관된 UI/UX를 위해 필요하나 긴급하지 않음",
        completed: false,
      },
      {
        id: "3",
        title: "팀 주간 회의 준비",
        category: "미팅",
        priority: 88,
        urgency: "긴급",
        reason: "내일 오전 회의 예정",
        completed: false,
      },
      {
        id: "4",
        title: "고객 문의 답변",
        category: "이메일",
        priority: 65,
        urgency: "보통",
        reason: "24시간 이내 답변 권장",
        completed: false,
      },
      {
        id: "5",
        title: "데이터베이스 최적화",
        category: "개발",
        priority: 70,
        urgency: "중요",
        reason: "성능 개선 필요",
        completed: true,
      },
      {
        id: "6",
        title: "마케팅 자료 제작",
        category: "디자인",
        priority: 60,
        urgency: "보통",
        reason: "다음 주 캠페인 예정",
        completed: false,
      },
    ],
  };
}
