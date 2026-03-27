import {
  DailyProgress,
  DefectPredictionCardData,
  FireSafetyCardData,
  HistoryItem,
  IssueItem,
  MaterialInboundCardData,
  ScannerInfo,
  SystemLogItem
} from './types';

export const SCANNER_INFO: ScannerInfo = {
  mainViewLabel: 'Main View · 타임체크 (순회점검)',
  operatorLabel: '서상훈 프로 · 현장 A라인',
  statusLabel: '정상 범위',
  metricLabel: '유압 · 145 bar',
  equipmentName: '사출기 #05',
  completedStep: 3,
  totalSteps: 15,
  nextCheck: '냉각수 온도 체크',
  eta: '14:30 예정',
  sectionTitle: 'SCANNING...'
};

export const SYSTEM_LOGS: SystemLogItem[] = [
  {
    id: 'log-1',
    time: '14:05:22',
    actor: '서상훈',
    message: '타임체크 · 사출기 #05 QR 스캔 완료',
    tone: 'blue'
  },
  {
    id: 'log-2',
    time: '14:05:18',
    actor: 'SYSTEM',
    message: 'VLM 데이터 수신 · 유압 정상 (145 bar)',
    tone: 'green'
  },
  {
    id: 'log-3',
    time: '14:05:10',
    actor: '김민석',
    message: '자재입고 · 거래명세서 OCR 인식 시작',
    tone: 'blue'
  },
  {
    id: 'log-4',
    time: '14:04:55',
    actor: '한사무엘',
    message: '소방관리 · A구역 소화기 #12 정위치 확인',
    tone: 'green'
  },
  {
    id: 'log-5',
    time: '14:04:42',
    actor: '김원준',
    message: '불량예측 · 로터볼트 불량 의심 패턴 감지',
    tone: 'amber'
  },
  {
    id: 'log-6',
    time: '14:04:30',
    actor: 'SYSTEM',
    message: 'SLLM 쿼리 요청 · "로터볼트 체결 불량 원인"',
    tone: 'neutral'
  },
  {
    id: 'log-7',
    time: '14:04:15',
    actor: '서상훈',
    message: '타임체크 · 사출기 #04 점검 완료',
    tone: 'blue'
  },
  {
    id: 'log-8',
    time: '14:04:01',
    actor: '전승원',
    message: 'MES 데이터 동기화 완료 (Batch #2403)',
    tone: 'neutral'
  },
  {
    id: 'log-9',
    time: '14:03:45',
    actor: 'SYSTEM',
    message: 'Alert · B라인 컨베이어 일시 정지 신호 수신',
    tone: 'red'
  },
  {
    id: 'log-10',
    time: '14:03:30',
    actor: '김인형',
    message: '무작업관리 · B라인 담당자 문자 발송 완료',
    tone: 'blue'
  },
  {
    id: 'log-11',
    time: '14:03:15',
    actor: '서상훈',
    message: '타임체크 · 순회점검 시작 (Route A)',
    tone: 'blue'
  }
];

export const MATERIAL_INBOUND_CARD: MaterialInboundCardData = {
  documentId: '거래명세서 #2026-0304-A',
  progress: 60
};

export const FIRE_SAFETY_CARD: FireSafetyCardData = {
  zone: 'A구역 점검 완료',
  description: '이상 없음'
};

export const DEFECT_PREDICTION_CARD: DefectPredictionCardData = {
  title: '로터볼트 체결 불량',
  confidence: 94.2,
  label: 'SLLM 분석 결과'
};

export const TIMECHECK_HISTORY: HistoryItem[] = [
  {
    id: 'history-1',
    time: '14:04',
    equipment: '사출기 #04',
    inspector: '서상훈',
    result: '정상',
    tone: 'green'
  },
  {
    id: 'history-2',
    time: '13:58',
    equipment: '사출기 #03',
    inspector: '서상훈',
    result: '정상',
    tone: 'green'
  },
  {
    id: 'history-3',
    time: '13:52',
    equipment: '사출기 #02',
    inspector: '서상훈',
    result: '정상',
    tone: 'green'
  },
  {
    id: 'history-4',
    time: '13:45',
    equipment: '사출기 #01',
    inspector: '서상훈',
    result: '조치완료',
    tone: 'blue'
  }
];

export const DAILY_PROGRESS: DailyProgress = {
  target: 50,
  completed: 39,
  percent: 78
};

export const ISSUE_ITEMS: IssueItem[] = [
  {
    id: 'issue-1',
    title: 'B라인 컨베이어 소음',
    time: '14:03',
    detail: '로터볼트 확인 요청 중',
    tone: 'red'
  },
  {
    id: 'issue-2',
    title: 'MCT-02 유압유 부족',
    time: '13:15',
    detail: '교체 예정 (자재 불출)',
    tone: 'amber'
  }
];
