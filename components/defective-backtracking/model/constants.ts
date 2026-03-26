import type {
  DefectTypeStat,
  RepairHistoryItem,
  RepairTimeStat,
  SummaryCardData
} from './types';

export const SUMMARY_CARDS: SummaryCardData[] = [
  {
    id: 'today-incident',
    label: '금일 발생',
    value: 12,
    icon: 'trend'
  },
  {
    id: 'in-progress',
    label: '처리 중',
    value: 8,
    icon: 'gear'
  },
  {
    id: 'completed',
    label: '완료',
    value: 105,
    icon: 'check'
  }
];

export const DEFECT_TYPE_STATS: DefectTypeStat[] = [
  {
    id: 'rotor-belt',
    label: '로터벨트',
    value: 40,
    color: '#0b5f97'
  },
  {
    id: 'stator-belt',
    label: '스테이터벨트',
    value: 30,
    color: '#63afea'
  },
  {
    id: 'side-belt',
    label: '사이드벨트',
    value: 20,
    color: '#15a7a8'
  },
  {
    id: 'other',
    label: '기타',
    value: 10,
    color: '#b5bdc6'
  }
];

export const REPAIR_TIME_STATS: RepairTimeStat[] = [
  {
    id: 'mon',
    label: '월',
    hours: 1.5,
    tone: 'primary'
  },
  {
    id: 'tue',
    label: '화',
    hours: 2,
    tone: 'primary'
  },
  {
    id: 'wed',
    label: '수',
    hours: 1,
    tone: 'primary'
  },
  {
    id: 'thu',
    label: '목',
    hours: 1.5,
    tone: 'primary'
  },
  {
    id: 'fri',
    label: '금',
    hours: 2,
    tone: 'primary'
  },
  {
    id: 'sat',
    label: '토',
    hours: 2.5,
    tone: 'primary'
  },
  {
    id: 'sun',
    label: '일',
    hours: 1,
    tone: 'muted'
  }
];

export const REPAIR_HISTORY: RepairHistoryItem[] = [
  {
    id: 'history-1430',
    time: '14:30',
    title: '로터벨트 불량',
    worker: '김철수',
    action: '부품 교체 완료',
    icon: 'wrench'
  },
  {
    id: 'history-1315',
    time: '13:15',
    title: '스테이터벨트 불량',
    worker: '박영희',
    action: '조정 후 정상',
    icon: 'sensor'
  },
  {
    id: 'history-1100',
    time: '11:00',
    title: '사이드벨트 불량',
    worker: '이민준',
    action: '재검토 필요',
    icon: 'wrench'
  },
  {
    id: 'history-1000',
    time: '10:00',
    title: '기타 불량',
    worker: '최지수',
    action: '기록 완료',
    icon: 'note'
  },
  {
    id: 'history-0930',
    time: '09:30',
    title: '로터벨트 불량',
    worker: '김철수',
    action: '수리 진행 중',
    icon: 'wrench'
  }
];
