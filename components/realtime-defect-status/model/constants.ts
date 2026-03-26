import type {
  DefectTypeStat,
  RepairHistoryItem,
  RepairTimeStat,
  SummaryCard
} from './types';

export const SUMMARY_CARDS: SummaryCard[] = [
  {
    id: 'incident',
    label: '금일 발생',
    value: 12,
    caption: '실시간 감지된 신규 불량',
    icon: '↗',
    tone: 'incident'
  },
  {
    id: 'processing',
    label: '처리 중',
    value: 8,
    caption: '현장 확인 및 조치 진행',
    icon: '⚙',
    tone: 'processing'
  },
  {
    id: 'done',
    label: '완료',
    value: 105,
    caption: '정상 범위 복귀 및 종료',
    icon: '✓',
    tone: 'done'
  }
];

export const DEFECT_TYPE_STATS: DefectTypeStat[] = [
  {
    id: 'rotor-belt',
    label: '로터블트',
    value: 40,
    tone: 'blue'
  },
  {
    id: 'stator-belt',
    label: '스테이터블트',
    value: 30,
    tone: 'cyan'
  },
  {
    id: 'side-belt',
    label: '사이드블트',
    value: 20,
    tone: 'green'
  },
  {
    id: 'others',
    label: '기타',
    value: 10,
    tone: 'slate'
  }
];

export const REPAIR_TIME_STATS: RepairTimeStat[] = [
  {
    id: 'mon',
    label: '월',
    hours: 1.5
  },
  {
    id: 'tue',
    label: '화',
    hours: 2.0
  },
  {
    id: 'wed',
    label: '수',
    hours: 1.0
  },
  {
    id: 'thu',
    label: '목',
    hours: 1.5
  },
  {
    id: 'fri',
    label: '금',
    hours: 2.0
  },
  {
    id: 'sat',
    label: '토',
    hours: 2.5
  },
  {
    id: 'sun',
    label: '일',
    hours: 1.0
  }
];

export const REPAIR_HISTORY: RepairHistoryItem[] = [
  {
    id: 'history-1',
    time: '14:30',
    title: '로터블트 불량',
    worker: '김철수',
    action: '부품 교체 완료',
    detail: '마모된 부품 교체 후 기준 진동값 안으로 복귀했습니다.',
    tone: 'done'
  },
  {
    id: 'history-2',
    time: '13:15',
    title: '스테이터블트 불량',
    worker: '박영희',
    action: '조정 후 정상',
    detail: '장력값 재조정 이후 센서 판독과 위치 정렬이 모두 안정화되었습니다.',
    tone: 'done'
  },
  {
    id: 'history-3',
    time: '11:00',
    title: '사이드블트 불량',
    worker: '이민준',
    action: '세척 필요',
    detail: '잔여 이물로 인한 미끄럼 패턴이 남아 있어 세척 후 재가동이 필요합니다.',
    tone: 'processing'
  },
  {
    id: 'history-4',
    time: '10:00',
    title: '기타 불량',
    worker: '최지수',
    action: '기록 완료',
    detail: '이상 징후는 종료되었고 일시적 이벤트로 분류되어 기록만 남겼습니다.',
    tone: 'done'
  },
  {
    id: 'history-5',
    time: '09:30',
    title: '로터블트 불량',
    worker: '김철수',
    action: '수리 진행 중',
    detail: '롤러부 변형 원인을 점검 중이며 예비 부품 대체 투입을 준비하고 있습니다.',
    tone: 'incident'
  }
];
