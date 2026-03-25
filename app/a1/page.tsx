'use client';

import { useEffect, useMemo, useReducer } from 'react';
import styled, { css, keyframes } from 'styled-components';

type CheckpointStatus = 'ok' | 'warning' | 'error' | 'idle';
type LogLevel = 'ok' | 'warning' | 'error';
type LogFilter = 'all' | LogLevel;

interface TimeSlot {
  id: string;
  label: string;
  caption: string;
}

interface Checkpoint {
  id: string;
  code: string;
  label: string;
  status: CheckpointStatus;
  inspector: string;
  lastChecked: string;
  note: string;
}

interface ProductionLine {
  id: string;
  name: string;
  shift: string;
  checkpoints: Checkpoint[];
}

interface InspectionLog {
  id: string;
  time: string;
  slotId: string;
  lineId: string;
  lineName: string;
  checkpointId: string;
  checkpointLabel: string;
  level: LogLevel;
  title: string;
  detail: string;
  inspector: string;
}

interface DashboardState {
  lines: ProductionLine[];
  logs: InspectionLog[];
  selectedLineId: string;
  selectedCheckpointId: string;
  selectedTimeSlotId: string;
  logFilter: LogFilter;
  autoRun: boolean;
}

type DashboardAction =
  | {
      type: 'select-line';
      lineId: string;
    }
  | {
      type: 'select-checkpoint';
      lineId: string;
      checkpointId: string;
    }
  | {
      type: 'select-time-slot';
      slotId: string;
    }
  | {
      type: 'set-log-filter';
      filter: LogFilter;
    }
  | {
      type: 'toggle-auto-run';
    }
  | {
      type: 'manual-update';
      lineId: string;
      checkpointId: string;
      status: Exclude<CheckpointStatus, 'idle'>;
    }
  | {
      type: 'auto-random-update';
    };

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(74, 140, 255, 0.18);
  }
  70% {
    transform: scale(1.06);
    box-shadow: 0 0 0 14px rgba(74, 140, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(74, 140, 255, 0);
  }
`;

const TIME_SLOTS: TimeSlot[] = [
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

const INSPECTORS = [
  '김현수',
  '이민재',
  '박수빈',
  '정하린',
  '최도윤'
];

const CIRCLE_RADIUS = 76;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

const buttonReset = css`
  appearance: none;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;

const getStatusLabel = (status: CheckpointStatus): string => {
  switch (status) {
    case 'ok':
      return '정상';
    case 'warning':
      return '주의';
    case 'error':
      return '중단';
    case 'idle':
      return '대기';
    default:
      return status;
  }
};

const getLogLevelLabel = (level: LogLevel): string => {
  switch (level) {
    case 'ok':
      return '정상';
    case 'warning':
      return '주의';
    case 'error':
      return '위험';
    default:
      return level;
  }
};

const getStatusNote = (
  status: CheckpointStatus,
  source: 'manual' | 'auto',
  checkpointLabel: string
): string => {
  const prefix =
    source === 'manual'
      ? '운영자 수동 갱신'
      : '실시간 모니터링 갱신';

  switch (status) {
    case 'ok':
      return `${prefix} · ${checkpointLabel} 상태 정상`;
    case 'warning':
      return `${prefix} · ${checkpointLabel} 편차 감지, 추가 확인 필요`;
    case 'error':
      return `${prefix} · ${checkpointLabel} 이상 발생, 즉시 조치 필요`;
    case 'idle':
      return `${prefix} · ${checkpointLabel} 점검 대기`;
    default:
      return prefix;
  }
};

const createCheckpoint = (
  lineId: string,
  order: number,
  label: string,
  status: CheckpointStatus,
  inspector: string,
  lastChecked: string
): Checkpoint => {
  return {
    id: `${lineId}-cp-${order}`,
    code: `${order}`,
    label,
    status,
    inspector,
    lastChecked,
    note: getStatusNote(status, 'auto', label)
  };
};

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

const countStatus = (
  checkpoints: Checkpoint[],
  status: CheckpointStatus
): number => {
  return checkpoints.filter((checkpoint) => checkpoint.status === status).length;
};

const calculateCompletionRate = (lines: ProductionLine[]): number => {
  const weights: Record<CheckpointStatus, number> = {
    ok: 1,
    warning: 0.45,
    error: 0.05,
    idle: 0.15
  };

  const checkpoints = lines.flatMap((line) => line.checkpoints);
  const totalScore = checkpoints.reduce((sum, checkpoint) => {
    return sum + weights[checkpoint.status];
  }, 0);

  const rate = (totalScore / checkpoints.length) * 100;

  return Math.round(rate);
};

const randomFrom = <T,>(items: readonly T[]): T => {
  return items[Math.floor(Math.random() * items.length)] as T;
};

const pickNextStatus = (
  current: CheckpointStatus
): Exclude<CheckpointStatus, 'idle'> => {
  const pool: Exclude<CheckpointStatus, 'idle'>[] = [
    'ok',
    'ok',
    'ok',
    'warning',
    'warning',
    'error'
  ];

  let next = randomFrom(pool);

  if (next === current) {
    if (current === 'ok') {
      next = 'warning';
    } else if (current === 'warning') {
      next = 'ok';
    } else {
      next = 'ok';
    }
  }

  return next;
};

const formatClock = (date: Date): string => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const createLogEntry = (payload: {
  time: string;
  slotId: string;
  lineId: string;
  lineName: string;
  checkpointId: string;
  checkpointLabel: string;
  level: LogLevel;
  status: Exclude<CheckpointStatus, 'idle'>;
  inspector: string;
  source: 'manual' | 'auto';
}): InspectionLog => {
  const detailByStatus: Record<Exclude<CheckpointStatus, 'idle'>, string> = {
    ok:
      payload.source === 'manual'
        ? '운영자가 정상 상태로 확정, 생산 흐름 유지'
        : '센서 및 작업 이력 기준 정상 범위 확인',
    warning:
      payload.source === 'manual'
        ? '운영자가 주의 상태로 지정, 재확인 필요'
        : '경계값 접근 또는 미세 편차 감지, 추가 확인 권장',
    error:
      payload.source === 'manual'
        ? '운영자가 즉시 중단 처리, 현장 확인 필요'
        : '이상 패턴 감지, 라인 점검 및 조치 필요'
  };

  const titleByStatus: Record<Exclude<CheckpointStatus, 'idle'>, string> = {
    ok: `${payload.checkpointLabel} 정상 확인`,
    warning: `${payload.checkpointLabel} 주의 감지`,
    error: `${payload.checkpointLabel} 이상 발생`
  };

  return {
    id: `log-${payload.lineId}-${payload.checkpointId}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    time: payload.time,
    slotId: payload.slotId,
    lineId: payload.lineId,
    lineName: payload.lineName,
    checkpointId: payload.checkpointId,
    checkpointLabel: payload.checkpointLabel,
    level: payload.level,
    title: titleByStatus[payload.status],
    detail: detailByStatus[payload.status],
    inspector: payload.inspector
  };
};

const applyStatusUpdate = (
  state: DashboardState,
  payload: {
    lineId: string;
    checkpointId: string;
    status: Exclude<CheckpointStatus, 'idle'>;
    slotId: string;
    source: 'manual' | 'auto';
  }
): DashboardState => {
  const time = formatClock(new Date());
  const inspector =
    payload.source === 'manual'
      ? '운영자 직접 조정'
      : randomFrom(INSPECTORS);

  let updatedLineName = '';
  let updatedCheckpointLabel = '';

  const nextLines = state.lines.map((line) => {
    if (line.id !== payload.lineId) {
      return line;
    }

    updatedLineName = line.name;

    return {
      ...line,
      checkpoints: line.checkpoints.map((checkpoint) => {
        if (checkpoint.id !== payload.checkpointId) {
          return checkpoint;
        }

        updatedCheckpointLabel = checkpoint.label;

        return {
          ...checkpoint,
          status: payload.status,
          inspector,
          lastChecked: time,
          note: getStatusNote(payload.status, payload.source, checkpoint.label)
        };
      })
    };
  });

  const level: LogLevel =
    payload.status === 'error'
      ? 'error'
      : payload.status === 'warning'
        ? 'warning'
        : 'ok';

  const nextLog = createLogEntry({
    time,
    slotId: payload.slotId,
    lineId: payload.lineId,
    lineName: updatedLineName,
    checkpointId: payload.checkpointId,
    checkpointLabel: updatedCheckpointLabel,
    level,
    status: payload.status,
    inspector,
    source: payload.source
  });

  return {
    ...state,
    lines: nextLines,
    logs: [nextLog, ...state.logs].slice(0, 18),
    selectedLineId: payload.lineId,
    selectedCheckpointId: payload.checkpointId
  };
};

const dashboardReducer = (
  state: DashboardState,
  action: DashboardAction
): DashboardState => {
  switch (action.type) {
    case 'select-line': {
      const line = state.lines.find((item) => item.id === action.lineId);

      if (!line) {
        return state;
      }

      const hasSelectedCheckpoint = line.checkpoints.some((checkpoint) => {
        return checkpoint.id === state.selectedCheckpointId;
      });

      return {
        ...state,
        selectedLineId: action.lineId,
        selectedCheckpointId: hasSelectedCheckpoint
          ? state.selectedCheckpointId
          : line.checkpoints[0]?.id ?? state.selectedCheckpointId
      };
    }

    case 'select-checkpoint':
      return {
        ...state,
        selectedLineId: action.lineId,
        selectedCheckpointId: action.checkpointId
      };

    case 'select-time-slot':
      return {
        ...state,
        selectedTimeSlotId: action.slotId
      };

    case 'set-log-filter':
      return {
        ...state,
        logFilter: action.filter
      };

    case 'toggle-auto-run':
      return {
        ...state,
        autoRun: !state.autoRun
      };

    case 'manual-update':
      return applyStatusUpdate(state, {
        lineId: action.lineId,
        checkpointId: action.checkpointId,
        status: action.status,
        slotId: state.selectedTimeSlotId,
        source: 'manual'
      });

    case 'auto-random-update': {
      const line = randomFrom(state.lines);
      const checkpoint = randomFrom(line.checkpoints);
      const nextStatus = pickNextStatus(checkpoint.status);

      return applyStatusUpdate(state, {
        lineId: line.id,
        checkpointId: checkpoint.id,
        status: nextStatus,
        slotId: state.selectedTimeSlotId,
        source: 'auto'
      });
    }

    default:
      return state;
  }
};

const initialLines = createInitialLines();

const initialState: DashboardState = {
  lines: initialLines,
  logs: createInitialLogs(),
  selectedLineId: 'line-b',
  selectedCheckpointId: 'line-b-cp-3',
  selectedTimeSlotId: '14:00',
  logFilter: 'all',
  autoRun: true
};

const PageShell = styled.main`
  min-height: 100vh;
  padding: 28px;
  background:
    radial-gradient(circle at 0% 0%, rgba(58, 96, 168, 0.22) 0%, rgba(58, 96, 168, 0) 30%),
    radial-gradient(circle at 100% 0%, rgba(26, 52, 98, 0.28) 0%, rgba(26, 52, 98, 0) 34%),
    linear-gradient(180deg, #091326 0%, #08101f 40%, #050b16 100%);
  color: #f5f7ff;
`;

const HeaderBar = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
`;

const TitleBlock = styled.div`
  display: grid;
  gap: 8px;
`;

const Eyebrow = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #7e97c9;
`;

const MainTitle = styled.h1`
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.04em;
`;

const SubText = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #9db0d7;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const HeaderPill = styled.div<{ $tone: 'live' | 'ok' | 'warning' | 'error' | 'neutral' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'live':
          return 'rgba(74, 140, 255, 0.42)';
        case 'ok':
          return 'rgba(46, 209, 129, 0.28)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.28)';
        case 'error':
          return 'rgba(255, 92, 108, 0.28)';
        default:
          return 'rgba(133, 154, 194, 0.2)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'live':
          return 'rgba(74, 140, 255, 0.14)';
        case 'ok':
          return 'rgba(46, 209, 129, 0.12)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.12)';
        case 'error':
          return 'rgba(255, 92, 108, 0.12)';
        default:
          return 'rgba(109, 127, 163, 0.12)';
      }
    }};
  font-size: 13px;
  font-weight: 700;
  color: #eef3ff;
`;

const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #4a8cff;
  box-shadow: 0 0 16px rgba(74, 140, 255, 0.8);
`;

const AutoRunButton = styled.button<{ $active: boolean }>`
  ${buttonReset};
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(74, 140, 255, 0.42)' : 'rgba(133, 154, 194, 0.2)')};
  background: ${({ $active }) => ($active ? 'rgba(74, 140, 255, 0.14)' : 'rgba(13, 24, 46, 0.92)')};
  font-size: 13px;
  font-weight: 700;
  color: #f5f7ff;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const DashboardGrid = styled.section`
  display: grid;
  grid-template-columns: 312px minmax(0, 1fr) 360px;
  gap: 20px;
  min-height: calc(100vh - 164px);

  @media (max-width: 1380px) {
    grid-template-columns: 280px minmax(0, 1fr) 320px;
  }
`;

const LeftColumn = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px;
`;

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 22px;
  border-radius: 26px;
  border: 1px solid rgba(133, 154, 194, 0.16);
  background:
    linear-gradient(180deg, rgba(13, 24, 46, 0.94) 0%, rgba(10, 18, 36, 0.94) 100%);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
`;

const CenterPanel = styled(Panel)`
  overflow: hidden;
`;

const RightPanel = styled(Panel)`
  overflow: hidden;
`;

const PanelTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
`;

const PanelTitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

const PanelCaption = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.65;
  color: #92a6cf;
`;

const RingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const RingInner = styled.div`
  position: relative;
  width: 216px;
  height: 216px;
`;

const RingSvg = styled.svg`
  width: 216px;
  height: 216px;
  transform: rotate(-90deg);
`;

const RingTrack = styled.circle`
  fill: none;
  stroke: rgba(92, 114, 154, 0.18);
  stroke-width: 16;
`;

const RingValue = styled.circle<{ $percent: number }>`
  fill: none;
  stroke: #4a8cff;
  stroke-width: 16;
  stroke-linecap: round;
  stroke-dasharray: ${CIRCLE_CIRCUMFERENCE};
  stroke-dashoffset: ${({ $percent }) => CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * $percent) / 100};
  transition:
    stroke-dashoffset 800ms cubic-bezier(0.22, 1, 0.36, 1),
    stroke 180ms ease;
  filter: drop-shadow(0 0 18px rgba(74, 140, 255, 0.28));
`;

const RingCenter = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
`;

const RingValueText = styled.div`
  display: grid;
  gap: 10px;
  text-align: center;
`;

const RingNumber = styled.div`
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -0.05em;
`;

const RingLabel = styled.div`
  font-size: 13px;
  line-height: 1.6;
  color: #9ab0da;
`;

const QuickStatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
`;

const QuickStatCard = styled.div`
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(133, 154, 194, 0.12);
  background: rgba(16, 28, 53, 0.8);
`;

const QuickStatLabel = styled.div`
  font-size: 12px;
  color: #7e97c9;
`;

const QuickStatValue = styled.div`
  margin-top: 8px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

const SlotList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 8px;
`;

const SlotButton = styled.button<{ $active: boolean }>`
  ${buttonReset};
  display: grid;
  gap: 6px;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(74, 140, 255, 0.42)' : 'rgba(133, 154, 194, 0.12)')};
  background: ${({ $active }) => ($active ? 'rgba(74, 140, 255, 0.12)' : 'rgba(16, 28, 53, 0.78)')};
  text-align: left;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateX(3px);
  }
`;

const SlotTime = styled.div`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.04em;
`;

const SlotCaption = styled.div`
  font-size: 12px;
  color: #8ea0c7;
`;

const SlotIndicator = styled.div<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#4a8cff' : 'rgba(122, 140, 181, 0.36)')};
  box-shadow: ${({ $active }) => ($active ? '0 0 14px rgba(74, 140, 255, 0.55)' : 'none')};
`;

const SlotRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const LineHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
`;

const LineHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const MiniPill = styled.div<{ $tone: 'ok' | 'warning' | 'error' | 'neutral' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.24)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.24)';
        case 'error':
          return 'rgba(255, 92, 108, 0.24)';
        default:
          return 'rgba(133, 154, 194, 0.18)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.1)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.1)';
        case 'error':
          return 'rgba(255, 92, 108, 0.1)';
        default:
          return 'rgba(19, 34, 62, 0.82)';
      }
    }};
  font-size: 12px;
  font-weight: 700;
  color: #eff4ff;
`;

const LinesArea = styled.div`
  display: grid;
  gap: 14px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
`;

const LineRow = styled.div<{ $selected: boolean }>`
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr) 168px;
  align-items: center;
  gap: 18px;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid ${({ $selected }) => ($selected ? 'rgba(74, 140, 255, 0.32)' : 'rgba(133, 154, 194, 0.12)')};
  background: ${({ $selected }) => ($selected ? 'rgba(18, 35, 67, 0.92)' : 'rgba(12, 22, 42, 0.74)')};
  box-shadow: ${({ $selected }) => ($selected ? '0 18px 38px rgba(0, 0, 0, 0.24)' : 'none')};
  transition:
    border-color 160ms ease,
    background 160ms ease,
    transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const LineLabelButton = styled.button<{ $selected: boolean }>`
  ${buttonReset};
  display: grid;
  gap: 6px;
  text-align: left;
`;

const LineName = styled.div`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

const LineShift = styled.div`
  font-size: 12px;
  color: #8ea0c7;
`;

const NodeRail = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
`;

const NodeTrack = styled.div`
  position: absolute;
  top: 24px;
  left: 9%;
  right: 9%;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(95, 123, 175, 0.22) 0%, rgba(95, 123, 175, 0.4) 100%);
`;

const NodeSlot = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 10px;
`;

const NodeButton = styled.button<{ $status: CheckpointStatus; $selected: boolean }>`
  ${buttonReset};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  border: 2px solid
    ${({ $status }) => {
      switch ($status) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.5)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.5)';
        case 'error':
          return 'rgba(255, 92, 108, 0.56)';
        case 'idle':
          return 'rgba(133, 154, 194, 0.22)';
        default:
          return 'rgba(133, 154, 194, 0.22)';
      }
    }};
  background:
    ${({ $status }) => {
      switch ($status) {
        case 'ok':
          return 'linear-gradient(180deg, rgba(46, 209, 129, 0.24) 0%, rgba(24, 90, 61, 0.62) 100%)';
        case 'warning':
          return 'linear-gradient(180deg, rgba(255, 182, 72, 0.24) 0%, rgba(117, 76, 21, 0.62) 100%)';
        case 'error':
          return 'linear-gradient(180deg, rgba(255, 92, 108, 0.24) 0%, rgba(126, 34, 47, 0.68) 100%)';
        case 'idle':
          return 'linear-gradient(180deg, rgba(133, 154, 194, 0.12) 0%, rgba(32, 47, 75, 0.72) 100%)';
        default:
          return 'linear-gradient(180deg, rgba(133, 154, 194, 0.12) 0%, rgba(32, 47, 75, 0.72) 100%)';
      }
    }};
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
  box-shadow: ${({ $selected }) => ($selected ? '0 0 0 6px rgba(74, 140, 255, 0.16)' : 'none')};
  ${({ $selected }) => 
    $selected 
      ? css`
          animation: ${pulse} 2.1s infinite;
        ` 
      : 'animation: none;'
  }
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const NodeLabel = styled.div<{ $selected: boolean }>`
  font-size: 11px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 600)};
  color: ${({ $selected }) => ($selected ? '#eef4ff' : '#7f94bf')};
  text-align: center;
  line-height: 1.4;
`;

const LineSummary = styled.div`
  display: grid;
  gap: 8px;
  justify-items: end;
`;

const SummaryPill = styled.div<{ $tone: 'ok' | 'warning' | 'error' }>`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.24)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.24)';
        case 'error':
          return 'rgba(255, 92, 108, 0.24)';
        default:
          return 'rgba(133, 154, 194, 0.18)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.1)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.1)';
        case 'error':
          return 'rgba(255, 92, 108, 0.1)';
        default:
          return 'rgba(133, 154, 194, 0.1)';
      }
    }};
  font-size: 11px;
  font-weight: 700;
  color: #eff3ff;
`;

const DetailCard = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.8fr);
  gap: 16px;
  margin-top: 18px;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(133, 154, 194, 0.12);
  background: rgba(11, 20, 39, 0.82);
`;

const DetailInfo = styled.div`
  display: grid;
  gap: 14px;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const DetailTitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const DetailEyebrow = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7f95c0;
`;

const DetailTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

const StatusBadge = styled.div<{ $status: CheckpointStatus }>`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $status }) => {
      switch ($status) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.26)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.26)';
        case 'error':
          return 'rgba(255, 92, 108, 0.26)';
        case 'idle':
          return 'rgba(133, 154, 194, 0.18)';
        default:
          return 'rgba(133, 154, 194, 0.18)';
      }
    }};
  background:
    ${({ $status }) => {
      switch ($status) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.12)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.12)';
        case 'error':
          return 'rgba(255, 92, 108, 0.12)';
        case 'idle':
          return 'rgba(133, 154, 194, 0.1)';
        default:
          return 'rgba(133, 154, 194, 0.1)';
      }
    }};
  font-size: 12px;
  font-weight: 700;
  color: #eef3ff;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;

const DetailMetric = styled.div`
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(133, 154, 194, 0.1);
  background: rgba(16, 28, 53, 0.74);
`;

const DetailMetricLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #7f95c0;
`;

const DetailMetricValue = styled.div`
  margin-top: 8px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
`;

const DetailNote = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(133, 154, 194, 0.1);
  background: rgba(16, 28, 53, 0.66);
  font-size: 14px;
  line-height: 1.7;
  color: #9bb0d9;
`;

const ActionPanel = styled.div`
  display: grid;
  align-content: space-between;
  gap: 16px;
`;

const ActionTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #eef3ff;
`;

const ActionDescription = styled.div`
  font-size: 13px;
  line-height: 1.7;
  color: #94a8d1;
`;

const ActionButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;

const StatusActionButton = styled.button<{ $tone: 'ok' | 'warning' | 'error' }>`
  ${buttonReset};
  min-height: 50px;
  border-radius: 16px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.26)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.26)';
        case 'error':
          return 'rgba(255, 92, 108, 0.26)';
        default:
          return 'rgba(133, 154, 194, 0.18)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.12)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.12)';
        case 'error':
          return 'rgba(255, 92, 108, 0.12)';
        default:
          return 'rgba(16, 28, 53, 0.7)';
      }
    }};
  font-size: 14px;
  font-weight: 700;
  color: #f7fbff;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  ${buttonReset};
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(74, 140, 255, 0.36)' : 'rgba(133, 154, 194, 0.16)')};
  background: ${({ $active }) => ($active ? 'rgba(74, 140, 255, 0.12)' : 'rgba(15, 28, 53, 0.76)')};
  font-size: 12px;
  font-weight: 700;
  color: #eef3ff;
`;

const TimelineWrap = styled.div`
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
`;

const TimelineList = styled.div`
  display: grid;
  gap: 14px;
`;

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 56px 18px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
`;

const TimelineTime = styled.div`
  padding-top: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #7f95c0;
`;

const TimelineAxis = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  min-height: 100%;
`;

const TimelineAxisLine = styled.div`
  position: absolute;
  top: 0;
  bottom: -14px;
  width: 2px;
  background: rgba(133, 154, 194, 0.18);
`;

const TimelineDot = styled.div<{ $level: LogLevel }>`
  position: relative;
  z-index: 1;
  width: 12px;
  height: 12px;
  margin-top: 10px;
  border-radius: 999px;
  background:
    ${({ $level }) => {
      switch ($level) {
        case 'ok':
          return '#2ed181';
        case 'warning':
          return '#ffb648';
        case 'error':
          return '#ff5c6c';
        default:
          return '#4a8cff';
      }
    }};
  box-shadow:
    ${({ $level }) => {
      switch ($level) {
        case 'ok':
          return '0 0 14px rgba(46, 209, 129, 0.6)';
        case 'warning':
          return '0 0 14px rgba(255, 182, 72, 0.56)';
        case 'error':
          return '0 0 14px rgba(255, 92, 108, 0.56)';
        default:
          return '0 0 14px rgba(74, 140, 255, 0.56)';
      }
    }};
`;

const TimelineCardButton = styled.button<{ $focused: boolean }>`
  ${buttonReset};
  display: grid;
  gap: 8px;
  width: 100%;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid ${({ $focused }) => ($focused ? 'rgba(74, 140, 255, 0.32)' : 'rgba(133, 154, 194, 0.12)')};
  background: ${({ $focused }) => ($focused ? 'rgba(18, 35, 67, 0.92)' : 'rgba(15, 28, 53, 0.76)')};
  text-align: left;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const TimelineCardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const TimelineTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
`;

const TimelineBadge = styled.div<{ $level: LogLevel }>`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid
    ${({ $level }) => {
      switch ($level) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.26)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.26)';
        case 'error':
          return 'rgba(255, 92, 108, 0.26)';
        default:
          return 'rgba(133, 154, 194, 0.18)';
      }
    }};
  background:
    ${({ $level }) => {
      switch ($level) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.1)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.1)';
        case 'error':
          return 'rgba(255, 92, 108, 0.1)';
        default:
          return 'rgba(15, 28, 53, 0.76)';
      }
    }};
  font-size: 11px;
  font-weight: 700;
  color: #eef3ff;
`;

const TimelineDetail = styled.div`
  font-size: 13px;
  line-height: 1.7;
  color: #9bb0d9;
`;

const TimelineMeta = styled.div`
  font-size: 12px;
  color: #7f95c0;
`;

const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 240px;
  padding: 18px;
  border-radius: 20px;
  border: 1px dashed rgba(133, 154, 194, 0.16);
  background: rgba(16, 28, 53, 0.5);
  text-align: center;
  font-size: 14px;
  line-height: 1.8;
  color: #8ea0c7;
`;

const SmartFactoryDashboard = () => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  useEffect(() => {
    if (!state.autoRun) {
      return;
    }

    const timer = window.setInterval(() => {
      dispatch({
        type: 'auto-random-update'
      });
    }, 3200);

    return () => {
      window.clearInterval(timer);
    };
  }, [state.autoRun]);

  const selectedLine = useMemo(() => {
    return state.lines.find((line) => line.id === state.selectedLineId) ?? state.lines[0];
  }, [state.lines, state.selectedLineId]);

  const selectedCheckpoint = useMemo(() => {
    return (
      selectedLine?.checkpoints.find((checkpoint) => {
        return checkpoint.id === state.selectedCheckpointId;
      }) ?? selectedLine?.checkpoints[0]
    );
  }, [selectedLine, state.selectedCheckpointId]);

  const selectedTimeSlot = useMemo(() => {
    return TIME_SLOTS.find((slot) => slot.id === state.selectedTimeSlotId) ?? TIME_SLOTS[0];
  }, [state.selectedTimeSlotId]);

  const completionRate = useMemo(() => {
    return calculateCompletionRate(state.lines);
  }, [state.lines]);

  const okCount = useMemo(() => {
    return state.lines.reduce((sum, line) => {
      return sum + countStatus(line.checkpoints, 'ok');
    }, 0);
  }, [state.lines]);

  const warningCount = useMemo(() => {
    return state.lines.reduce((sum, line) => {
      return sum + countStatus(line.checkpoints, 'warning');
    }, 0);
  }, [state.lines]);

  const errorCount = useMemo(() => {
    return state.lines.reduce((sum, line) => {
      return sum + countStatus(line.checkpoints, 'error');
    }, 0);
  }, [state.lines]);

  const visibleLogs = useMemo(() => {
    return state.logs
      .filter((log) => log.slotId === state.selectedTimeSlotId)
      .filter((log) => {
        if (state.logFilter === 'all') {
          return true;
        }

        return log.level === state.logFilter;
      });
  }, [state.logs, state.selectedTimeSlotId, state.logFilter]);

  return (
    <PageShell>
      <HeaderBar>
        <TitleBlock>
          <Eyebrow>smart factory control center</Eyebrow>
          <MainTitle>공정 점검 통합 대시보드</MainTitle>
          <SubText>
            생산 라인 상태, 타임체크 스케줄, 점검 이력을 남색 다크테마로 한눈에 확인할 수 있는
            인터렉티브 스마트 팩토리 페이지입니다.
          </SubText>
        </TitleBlock>

        <HeaderActions>
          <HeaderPill $tone="live">
            <LiveDot />
            실시간 모니터링
          </HeaderPill>
          <HeaderPill $tone="ok">정상 {okCount}</HeaderPill>
          <HeaderPill $tone="warning">주의 {warningCount}</HeaderPill>
          <HeaderPill $tone="error">중단 {errorCount}</HeaderPill>
          <AutoRunButton
            type="button"
            $active={state.autoRun}
            onClick={() => {
              dispatch({
                type: 'toggle-auto-run'
              });
            }}
          >
            {state.autoRun ? '자동 시뮬레이션 ON' : '자동 시뮬레이션 OFF'}
          </AutoRunButton>
        </HeaderActions>
      </HeaderBar>

      <DashboardGrid>
        <LeftColumn>
          <Panel>
            <PanelTop>
              <PanelTitleGroup>
                <PanelTitle>순회 점검 완료율</PanelTitle>
                <PanelCaption>생산 라인 전체 공정 상태를 가중치 기반으로 반영한 완료 지표</PanelCaption>
              </PanelTitleGroup>
            </PanelTop>

            <RingWrap>
              <RingInner>
                <RingSvg viewBox="0 0 216 216">
                  <RingTrack
                    cx="108"
                    cy="108"
                    r={CIRCLE_RADIUS}
                  />
                  <RingValue
                    cx="108"
                    cy="108"
                    r={CIRCLE_RADIUS}
                    $percent={completionRate}
                  />
                </RingSvg>

                <RingCenter>
                  <RingValueText>
                    <RingNumber>{completionRate}%</RingNumber>
                    <RingLabel>현재 공정 상태 기준 완료율</RingLabel>
                  </RingValueText>
                </RingCenter>
              </RingInner>
            </RingWrap>

            <QuickStatGrid>
              <QuickStatCard>
                <QuickStatLabel>선택 시간대</QuickStatLabel>
                <QuickStatValue>{selectedTimeSlot?.label}</QuickStatValue>
              </QuickStatCard>
              <QuickStatCard>
                <QuickStatLabel>활성 라인</QuickStatLabel>
                <QuickStatValue>{state.lines.length}개</QuickStatValue>
              </QuickStatCard>
            </QuickStatGrid>
          </Panel>

          <Panel>
            <PanelTop>
              <PanelTitleGroup>
                <PanelTitle>타임체크 관람</PanelTitle>
                <PanelCaption>시간대를 바꾸면 점검 이력과 수동 상태 변경 기록 기준이 함께 바뀝니다.</PanelCaption>
              </PanelTitleGroup>
            </PanelTop>

            <SlotList>
              {TIME_SLOTS.map((slot) => (
                <SlotButton
                  key={slot.id}
                  type="button"
                  $active={slot.id === state.selectedTimeSlotId}
                  onClick={() => {
                    dispatch({
                      type: 'select-time-slot',
                      slotId: slot.id
                    });
                  }}
                >
                  <SlotRow>
                    <SlotTime>{slot.label}</SlotTime>
                    <SlotIndicator $active={slot.id === state.selectedTimeSlotId} />
                  </SlotRow>
                  <SlotCaption>{slot.caption}</SlotCaption>
                </SlotButton>
              ))}
            </SlotList>
          </Panel>
        </LeftColumn>

        <CenterPanel>
          <LineHeaderRow>
            <PanelTitleGroup>
              <PanelTitle>생산 라인 현황</PanelTitle>
              <PanelCaption>
                라인 또는 스텝을 클릭해서 상세 상태를 확인하고, 하단 액션 버튼으로 상태를 직접 변경할 수 있습니다.
              </PanelCaption>
            </PanelTitleGroup>

            <LineHeaderActions>
              <MiniPill $tone="neutral">선택 시간대 · {selectedTimeSlot?.label}</MiniPill>
              <MiniPill $tone="neutral">선택 라인 · {selectedLine?.name}</MiniPill>
            </LineHeaderActions>
          </LineHeaderRow>

          <LinesArea>
            {state.lines.map((line) => (
              <LineRow
                key={line.id}
                $selected={line.id === selectedLine?.id}
              >
                <LineLabelButton
                  type="button"
                  $selected={line.id === selectedLine?.id}
                  onClick={() => {
                    dispatch({
                      type: 'select-line',
                      lineId: line.id
                    });
                  }}
                >
                  <LineName>{line.name}</LineName>
                  <LineShift>{line.shift}</LineShift>
                </LineLabelButton>

                <NodeRail>
                  <NodeTrack />

                  {line.checkpoints.map((checkpoint) => (
                    <NodeSlot key={checkpoint.id}>
                      <NodeButton
                        type="button"
                        $status={checkpoint.status}
                        $selected={checkpoint.id === selectedCheckpoint?.id}
                        onClick={() => {
                          dispatch({
                            type: 'select-checkpoint',
                            lineId: line.id,
                            checkpointId: checkpoint.id
                          });
                        }}
                      >
                        {checkpoint.code}
                      </NodeButton>

                      <NodeLabel $selected={checkpoint.id === selectedCheckpoint?.id}>
                        {checkpoint.label}
                      </NodeLabel>
                    </NodeSlot>
                  ))}
                </NodeRail>

                <LineSummary>
                  <SummaryPill $tone="ok">정상 {countStatus(line.checkpoints, 'ok')}</SummaryPill>
                  <SummaryPill $tone="warning">주의 {countStatus(line.checkpoints, 'warning')}</SummaryPill>
                  <SummaryPill $tone="error">중단 {countStatus(line.checkpoints, 'error')}</SummaryPill>
                </LineSummary>
              </LineRow>
            ))}
          </LinesArea>

          {selectedLine && selectedCheckpoint && (
            <DetailCard>
              <DetailInfo>
                <DetailHeader>
                  <DetailTitleGroup>
                    <DetailEyebrow>selected checkpoint</DetailEyebrow>
                    <DetailTitle>
                      {selectedLine.name} · {selectedCheckpoint.label}
                    </DetailTitle>
                  </DetailTitleGroup>

                  <StatusBadge $status={selectedCheckpoint.status}>
                    {getStatusLabel(selectedCheckpoint.status)}
                  </StatusBadge>
                </DetailHeader>

                <DetailGrid>
                  <DetailMetric>
                    <DetailMetricLabel>담당자</DetailMetricLabel>
                    <DetailMetricValue>{selectedCheckpoint.inspector}</DetailMetricValue>
                  </DetailMetric>

                  <DetailMetric>
                    <DetailMetricLabel>마지막 점검</DetailMetricLabel>
                    <DetailMetricValue>{selectedCheckpoint.lastChecked}</DetailMetricValue>
                  </DetailMetric>

                  <DetailMetric>
                    <DetailMetricLabel>선택 시간대</DetailMetricLabel>
                    <DetailMetricValue>{selectedTimeSlot?.label}</DetailMetricValue>
                  </DetailMetric>
                </DetailGrid>

                <DetailNote>{selectedCheckpoint.note}</DetailNote>
              </DetailInfo>

              <ActionPanel>
                <div>
                  <ActionTitle>상태 즉시 변경</ActionTitle>
                  <ActionDescription>
                    현장 운영자가 선택한 스텝 상태를 직접 수정하면, 우측 점검 이력에도 즉시 반영됩니다.
                  </ActionDescription>
                </div>

                <ActionButtonGrid>
                  <StatusActionButton
                    type="button"
                    $tone="ok"
                    onClick={() => {
                      dispatch({
                        type: 'manual-update',
                        lineId: selectedLine.id,
                        checkpointId: selectedCheckpoint.id,
                        status: 'ok'
                      });
                    }}
                  >
                    정상 처리
                  </StatusActionButton>

                  <StatusActionButton
                    type="button"
                    $tone="warning"
                    onClick={() => {
                      dispatch({
                        type: 'manual-update',
                        lineId: selectedLine.id,
                        checkpointId: selectedCheckpoint.id,
                        status: 'warning'
                      });
                    }}
                  >
                    주의 전환
                  </StatusActionButton>

                  <StatusActionButton
                    type="button"
                    $tone="error"
                    onClick={() => {
                      dispatch({
                        type: 'manual-update',
                        lineId: selectedLine.id,
                        checkpointId: selectedCheckpoint.id,
                        status: 'error'
                      });
                    }}
                  >
                    중단 처리
                  </StatusActionButton>
                </ActionButtonGrid>
              </ActionPanel>
            </DetailCard>
          )}
        </CenterPanel>

        <RightPanel>
          <PanelTop>
            <PanelTitleGroup>
              <PanelTitle>점검 이력</PanelTitle>
              <PanelCaption>
                시간대와 상태 필터를 조합해서 필요한 점검 기록만 빠르게 확인할 수 있습니다.
              </PanelCaption>
            </PanelTitleGroup>
          </PanelTop>

          <FilterRow>
            <FilterChip
              type="button"
              $active={state.logFilter === 'all'}
              onClick={() => {
                dispatch({
                  type: 'set-log-filter',
                  filter: 'all'
                });
              }}
            >
              전체
            </FilterChip>
            <FilterChip
              type="button"
              $active={state.logFilter === 'ok'}
              onClick={() => {
                dispatch({
                  type: 'set-log-filter',
                  filter: 'ok'
                });
              }}
            >
              정상
            </FilterChip>
            <FilterChip
              type="button"
              $active={state.logFilter === 'warning'}
              onClick={() => {
                dispatch({
                  type: 'set-log-filter',
                  filter: 'warning'
                });
              }}
            >
              주의
            </FilterChip>
            <FilterChip
              type="button"
              $active={state.logFilter === 'error'}
              onClick={() => {
                dispatch({
                  type: 'set-log-filter',
                  filter: 'error'
                });
              }}
            >
              위험
            </FilterChip>
          </FilterRow>

          <TimelineWrap>
            {visibleLogs.length === 0 ? (
              <EmptyState>
                현재 선택한 시간대와 필터 조건에 맞는 점검 이력이 없습니다.
                <br />
                시간대를 바꾸거나 자동 시뮬레이션을 켜서 데이터를 생성해보세요.
              </EmptyState>
            ) : (
              <TimelineList>
                {visibleLogs.map((log, index) => (
                  <TimelineItem key={log.id}>
                    <TimelineTime>{log.time}</TimelineTime>

                    <TimelineAxis>
                      {index < visibleLogs.length - 1 && <TimelineAxisLine />}
                      <TimelineDot $level={log.level} />
                    </TimelineAxis>

                    <TimelineCardButton
                      type="button"
                      $focused={
                        log.lineId === selectedLine?.id &&
                        log.checkpointId === selectedCheckpoint?.id
                      }
                      onClick={() => {
                        dispatch({
                          type: 'select-checkpoint',
                          lineId: log.lineId,
                          checkpointId: log.checkpointId
                        });
                      }}
                    >
                      <TimelineCardTop>
                        <TimelineTitle>{log.title}</TimelineTitle>
                        <TimelineBadge $level={log.level}>
                          {getLogLevelLabel(log.level)}
                        </TimelineBadge>
                      </TimelineCardTop>

                      <TimelineDetail>{log.detail}</TimelineDetail>

                      <TimelineMeta>
                        {log.lineName} · {log.checkpointLabel} · {log.inspector}
                      </TimelineMeta>
                    </TimelineCardButton>
                  </TimelineItem>
                ))}
              </TimelineList>
            )}
          </TimelineWrap>
        </RightPanel>
      </DashboardGrid>
    </PageShell>
  );
};

export default SmartFactoryDashboard;