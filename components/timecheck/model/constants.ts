import type {
  DashboardState,
  InspectionLog,
  ProductionLine,
  TimeSlot
} from './types';
import { createCheckpoint } from './helpers';

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: '14:00',
    label: '14:00',
    caption: '오후 1차 점검'
  },
  {
    id: '16:00',
    label: '16:00',
    caption: '오후 2차 점검'
  },
  {
    id: '18:00',
    label: '18:00',
    caption: '야간 투입 전 점검'
  },
  {
    id: '20:00',
    label: '20:00',
    caption: '마감 전 최종 점검'
  }
];

export const INSPECTORS = [
  '김현수',
  '이민재',
  '박수빈',
  '정하린',
  '최도윤'
] as const;

export const CIRCLE_RADIUS = 76;
export const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const createInitialLines = (): ProductionLine[] => {
  return [
    {
      id: 'line-a',
      name: '라인 A',
      shift: '조립 · 패키징',
      checkpoints: [
        createCheckpoint('line-a', 1, '원자재 투입', 'ok', '김현수', '13:42'),
        createCheckpoint('line-a', 2, '1차 조립', 'warning', '김현수', '13:44'),
        createCheckpoint('line-a', 3, '비전 검사', 'ok', '이민재', '13:46'),
        createCheckpoint('line-a', 4, '포장', 'ok', '박수빈', '13:49'),
        createCheckpoint('line-a', 5, '출하 대기', 'warning', '최도윤', '13:52')
      ]
    },
    {
      id: 'line-b',
      name: '라인 B',
      shift: '정밀 가공',
      checkpoints: [
        createCheckpoint('line-b', 1, '원자재 투입', 'ok', '박수빈', '13:38'),
        createCheckpoint('line-b', 2, '정밀 가공', 'ok', '박수빈', '13:41'),
        createCheckpoint('line-b', 3, '비전 검사', 'error', '정하린', '13:45'),
        createCheckpoint('line-b', 4, '보정', 'warning', '정하린', '13:47'),
        createCheckpoint('line-b', 5, '출하 대기', 'ok', '이민재', '13:50')
      ]
    },
    {
      id: 'line-c',
      name: '라인 C',
      shift: '검수 · 포장',
      checkpoints: [
        createCheckpoint('line-c', 1, '원자재 투입', 'warning', '이민재', '13:40'),
        createCheckpoint('line-c', 2, '1차 조립', 'ok', '김현수', '13:43'),
        createCheckpoint('line-c', 3, '비전 검사', 'ok', '최도윤', '13:45'),
        createCheckpoint('line-c', 4, '포장', 'ok', '최도윤', '13:48'),
        createCheckpoint('line-c', 5, '출하 대기', 'ok', '박수빈', '13:52')
      ]
    },
    {
      id: 'line-d',
      name: '라인 D',
      shift: '고속 출하',
      checkpoints: [
        createCheckpoint('line-d', 1, '원자재 투입', 'ok', '정하린', '13:36'),
        createCheckpoint('line-d', 2, '고속 조립', 'error', '정하린', '13:39'),
        createCheckpoint('line-d', 3, '비전 검사', 'ok', '이민재', '13:42'),
        createCheckpoint('line-d', 4, '포장', 'warning', '박수빈', '13:46'),
        createCheckpoint('line-d', 5, '출하 대기', 'ok', '김현수', '13:51')
      ]
    }
  ];
};

const createInitialLogs = (): InspectionLog[] => {
  return [
    {
      id: 'log-1',
      time: '20:12',
      slotId: '20:00',
      lineId: 'line-d',
      lineName: '라인 D',
      checkpointId: 'line-d-cp-4',
      checkpointLabel: '포장',
      level: 'warning',
      title: '포장 라인 속도 편차',
      detail: '권장 범위 대비 포장 속도 편차 7% 감지, 재점검 필요',
      inspector: '박수빈'
    },
    {
      id: 'log-2',
      time: '18:37',
      slotId: '18:00',
      lineId: 'line-b',
      lineName: '라인 B',
      checkpointId: 'line-b-cp-3',
      checkpointLabel: '비전 검사',
      level: 'error',
      title: '비전 검사 불량 감지',
      detail: '카메라 판독에서 외관 이상 패턴 확인, 라인 일시 정지',
      inspector: '정하린'
    },
    {
      id: 'log-3',
      time: '18:22',
      slotId: '18:00',
      lineId: 'line-d',
      lineName: '라인 D',
      checkpointId: 'line-d-cp-2',
      checkpointLabel: '고속 조립',
      level: 'warning',
      title: '모터 토크 재확인 필요',
      detail: '고속 조립 단계에서 토크 변동 감지, 추가 점검 요청',
      inspector: '정하린'
    },
    {
      id: 'log-4',
      time: '16:40',
      slotId: '16:00',
      lineId: 'line-a',
      lineName: '라인 A',
      checkpointId: 'line-a-cp-2',
      checkpointLabel: '1차 조립',
      level: 'warning',
      title: '조립 간격 편차 확인',
      detail: '조립 간격 허용 오차 경계값 접근, 정상 범위 재검토',
      inspector: '김현수'
    },
    {
      id: 'log-5',
      time: '16:12',
      slotId: '16:00',
      lineId: 'line-c',
      lineName: '라인 C',
      checkpointId: 'line-c-cp-1',
      checkpointLabel: '원자재 투입',
      level: 'ok',
      title: '원자재 투입 정상 완료',
      detail: '투입량과 센서 판독값 일치, 공정 정상 유지',
      inspector: '이민재'
    },
    {
      id: 'log-6',
      time: '14:51',
      slotId: '14:00',
      lineId: 'line-b',
      lineName: '라인 B',
      checkpointId: 'line-b-cp-4',
      checkpointLabel: '보정',
      level: 'warning',
      title: '보정 단계 재확인',
      detail: '정밀 가공 보정 수치가 임계치에 접근, 즉시 재검토',
      inspector: '정하린'
    },
    {
      id: 'log-7',
      time: '14:33',
      slotId: '14:00',
      lineId: 'line-a',
      lineName: '라인 A',
      checkpointId: 'line-a-cp-3',
      checkpointLabel: '비전 검사',
      level: 'ok',
      title: '비전 검사 정상 통과',
      detail: '외관 검사 패턴 정상, 다음 공정 진행',
      inspector: '이민재'
    },
    {
      id: 'log-8',
      time: '14:10',
      slotId: '14:00',
      lineId: 'line-c',
      lineName: '라인 C',
      checkpointId: 'line-c-cp-4',
      checkpointLabel: '포장',
      level: 'ok',
      title: '포장 공정 정상',
      detail: '라벨 정렬 및 포장 속도 정상 범위 확인',
      inspector: '최도윤'
    }
  ];
};

export const initialState: DashboardState = {
  lines: createInitialLines(),
  logs: createInitialLogs(),
  selectedLineId: 'line-b',
  selectedCheckpointId: 'line-b-cp-3',
  selectedTimeSlotId: '14:00',
  logFilter: 'all',
  autoRun: true
};
