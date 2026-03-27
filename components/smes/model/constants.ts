import type {
  DetailSection,
  DowntimeHistoryRow,
  KpiMetric,
  LotHistoryRow,
  ProductInfo,
  QuickMetric,
  StatusTile,
  SummaryMetric,
  WorkOrderRow
} from './types';

export const SUMMARY_METRICS: SummaryMetric[] = [
  {
    label: '총 계획 수량',
    value: '1910',
    accent: 'yellow'
  },
  {
    label: '현재 이론 수량',
    value: '1142',
    accent: 'green'
  },
  {
    label: '현재 생산 수량',
    value: '1132',
    accent: 'blue'
  }
];

export const KPI_METRICS: KpiMetric[] = [
  {
    label: '성능 가동률',
    value: '59.27%',
    accent: 'cyan'
  },
  {
    label: '시간 가동률',
    value: '92.58%',
    accent: 'green'
  },
  {
    label: '양품률',
    value: '99.12%',
    accent: 'blue'
  }
];

export const QUICK_METRICS: QuickMetric[] = [
  {
    label: '당일 총실적',
    value: '392',
    accent: 'yellow'
  },
  {
    label: 'Update Time',
    value: '16:29:03',
    accent: 'white'
  },
  {
    label: 'Timer',
    value: '01:05',
    accent: 'green'
  },
  {
    label: 'Cavity',
    value: '1',
    accent: 'orange'
  }
];

export const DETAIL_SECTIONS: DetailSection[] = [
  {
    id: 'injection',
    title: '1. INJECTION (사출 & 보압)',
    columns: ['단계', '시간 (sec)', '압력 (bar)', '속도 (%)', '보압 속도 / 위치 (mm)', ' ', ' ', ' '],
    rows: [
      ['1차', '0.5', '33', '25', '140', '140', '140', '140'],
      ['2차', '5.0', '45', '-', '35%', '45%', '55%', '40%'],
      ['3차', '0.0', '-', '-', '19', '35', '85', '165']
    ]
  },
  {
    id: 'temperature',
    title: '2. TEMPERATURE (온도 설정 ℃)',
    columns: ['OIL TEMP', 'CYLINDER (존5℃)', 'HN', 'H1', 'H2', 'H3', 'H4'],
    rows: [['40', '설정값', '200', '200', '200', '190', '180']]
  },
  {
    id: 'time-molding',
    title: '3. TIME & MOLDING (시간 및 형개폐)',
    columns: ['사출지연', '0 S', '계량지연', '0 S', '사출감시', '15 S', '냉각시간', '40 S'],
    rows: [['형폐시간', '5.6 초', '에젝터', '1 회', '형폐고압', '95 bar', '형개고압', '150 bar']]
  }
];

export const PRODUCT_INFO: ProductInfo = {
  pNo: '[HMJT63702703] 4.5 OUTER(B) 425A(후면)',
  name: '현재 품번',
  equipment: 'PCS1M0000',
  startDate: '02/10',
  endDate: '02/10',
  planQty: '350',
  statusNote: '급별 교환 후 정상 러닝 중',
  phaseLabel: '진행중'
};

export const EQUIPMENT_STATUS_TILES: StatusTile[] = [
  {
    id: 'state',
    label: 'STATE',
    value: 'RUN',
    accent: 'yellow',
    note: '가동중'
  },
  {
    id: 'readiness',
    label: 'READINESS',
    value: 'Monitor',
    accent: 'white',
    note: '실시간 확인'
  },
  {
    id: 'alarm',
    label: 'ALARM',
    value: 'None',
    accent: 'green',
    note: '현재 경보 없음'
  },
  {
    id: 'recipe',
    label: 'RECIPE',
    value: 'PCS1M',
    accent: 'blue',
    note: '세팅 적용중'
  }
];

export const WORK_ORDER_ROWS: WorkOrderRow[] = [
  {
    id: 'wo-1',
    workOrder: 'SD260210-14',
    start: '02/10',
    end: '02/10',
    plan: 350,
    input: 392,
    completed: 392,
    defect: 0
  },
  {
    id: 'wo-2',
    workOrder: 'SD260211-13',
    start: '02/11',
    end: '02/11',
    plan: 370,
    input: 0,
    completed: 0,
    defect: 0
  },
  {
    id: 'wo-3',
    workOrder: 'SD260212-08',
    start: '02/12',
    end: '02/12',
    plan: 300,
    input: 0,
    completed: 0,
    defect: 0
  },
  {
    id: 'wo-4',
    workOrder: 'SD260213-22',
    start: '02/13',
    end: '02/13',
    plan: 310,
    input: 0,
    completed: 0,
    defect: 0
  },
  {
    id: 'wo-5',
    workOrder: 'SD260214-09',
    start: '02/14',
    end: '02/14',
    plan: 280,
    input: 0,
    completed: 0,
    defect: 0
  }
];

export const DOWNTIME_HISTORY_ROWS: DowntimeHistoryRow[] = [
  {
    id: 'dt-1',
    reason: '5분비가동',
    startTime: '15:09:50',
    endTime: '15:09:53',
    stopSeconds: 3,
    worker: '김현수',
    grade: '정보'
  },
  {
    id: 'dt-2',
    reason: '5분비가동',
    startTime: '12:39:15',
    endTime: '12:40:43',
    stopSeconds: 1,
    worker: '박수빈',
    grade: '정보'
  },
  {
    id: 'dt-3',
    reason: '5분비가동',
    startTime: '09:25:51',
    endTime: '11:36:10',
    stopSeconds: 131,
    worker: '이민재',
    grade: '주의'
  },
  {
    id: 'dt-4',
    reason: '금형교체',
    startTime: '08:14:20',
    endTime: '08:31:42',
    stopSeconds: 17,
    worker: '정하린',
    grade: '정보'
  }
];

export const LOT_HISTORY_ROWS: LotHistoryRow[] = [
  {
    id: 'lot-1',
    lotId: 'HMJT63702703KSD26B0392',
    workOrder: 'SD260210-14',
    completedAt: '16:29:02',
    ct: 73
  },
  {
    id: 'lot-2',
    lotId: 'HMJT63702703SD260B0391',
    workOrder: 'SD260210-14',
    completedAt: '16:27:49',
    ct: 74
  },
  {
    id: 'lot-3',
    lotId: 'HMJT63702703SD260B0390',
    workOrder: 'SD260210-14',
    completedAt: '16:26:35',
    ct: 74
  },
  {
    id: 'lot-4',
    lotId: 'HMJT63702703SD260B0389',
    workOrder: 'SD260210-14',
    completedAt: '16:25:21',
    ct: 75
  }
];
