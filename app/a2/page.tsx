'use client';

import { useEffect, useMemo, useReducer } from 'react';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';

type CheckpointStatus = 'ok' | 'warning' | 'error' | 'idle';
type LogLevel = 'ok' | 'warning' | 'error';
type LogFilter = 'all' | LogLevel;
type RingTone = 'ok' | 'warning' | 'error';

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

const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  :root {
    color-scheme: dark;
    --bg: #06101f;
    --text-primary: #f7faff;
    --text-secondary: #adbedf;
    --text-muted: #7f95c2;
    --surface-1: rgba(12, 23, 44, 0.96);
    --surface-2: rgba(16, 31, 58, 0.9);
    --surface-3: rgba(20, 38, 69, 0.82);
    --border-soft: rgba(139, 160, 204, 0.16);
    --border-strong: rgba(93, 149, 255, 0.32);
    --blue: #5c9dff;
    --blue-soft: rgba(92, 157, 255, 0.14);
    --ok: #2fd07f;
    --warning: #ffbe55;
    --error: #ff6675;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    background: var(--bg);
    color: var(--text-primary);
    font-family: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body {
    overflow: hidden;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(132, 155, 202, 0.34);
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: rgba(132, 155, 202, 0.48);
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(92, 157, 255, 0.2);
  }
  70% {
    transform: scale(1.06);
    box-shadow: 0 0 0 14px rgba(92, 157, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(92, 157, 255, 0);
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

const INSPECTORS = ['김현수', '이민재', '박수빈', '정하린', '최도윤'];

const CIRCLE_RADIUS = 78;
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
  const prefix = source === 'manual' ? '운영자 수동 갱신' : '실시간 모니터링 갱신';

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

const countStatus = (checkpoints: Checkpoint[], status: CheckpointStatus): number => {
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

const pickNextStatus = (current: CheckpointStatus): Exclude<CheckpointStatus, 'idle'> => {
  const pool: Exclude<CheckpointStatus, 'idle'>[] = ['ok', 'ok', 'ok', 'warning', 'warning', 'error'];

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
  const inspector = payload.source === 'manual' ? '운영자 직접 조정' : randomFrom(INSPECTORS);

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

  const level: LogLevel = payload.status === 'error' ? 'error' : payload.status === 'warning' ? 'warning' : 'ok';

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

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
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
  position: relative;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 18px;
  height: 100vh;
  max-height: 100vh;
  padding: 18px;
  overflow: hidden;
  background:
    radial-gradient(circle at 0% 0%, rgba(68, 116, 210, 0.18) 0%, rgba(68, 116, 210, 0) 30%),
    radial-gradient(circle at 100% 0%, rgba(23, 48, 95, 0.26) 0%, rgba(23, 48, 95, 0) 34%),
    radial-gradient(circle at 50% 100%, rgba(20, 34, 61, 0.3) 0%, rgba(20, 34, 61, 0) 42%),
    linear-gradient(180deg, #0a1325 0%, #07101e 44%, #050a14 100%);

  @supports (height: 100dvh) {
    height: 100dvh;
    max-height: 100dvh;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(circle at center, black 28%, transparent 86%);
    opacity: 0.18;
  }
`;

const HeaderBar = styled.header`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 24px;
  border-radius: 28px;
  border: 1px solid rgba(139, 160, 204, 0.14);
  background: linear-gradient(180deg, rgba(12, 23, 44, 0.92) 0%, rgba(8, 16, 30, 0.92) 100%);
  box-shadow:
    0 18px 42px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

const TitleBlock = styled.div`
  display: grid;
  gap: 10px;
  min-width: 0;
`;

const Eyebrow = styled.div`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #7e97c9;
`;

const MainTitle = styled.h1`
  margin: 0;
  font-size: clamp(28px, 2.25vw, 38px);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1.1;
`;

const SubText = styled.p`
  margin: 0;
  max-width: 760px;
  font-size: 14px;
  line-height: 1.75;
  color: #a6b8db;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  align-self: center;
`;

const HeaderPill = styled.div<{ $tone: 'live' | 'ok' | 'warning' | 'error' | 'neutral' }>`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'live':
          return 'rgba(92, 157, 255, 0.38)';
        case 'ok':
          return 'rgba(47, 208, 127, 0.28)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.28)';
        case 'error':
          return 'rgba(255, 102, 117, 0.28)';
        default:
          return 'rgba(139, 160, 204, 0.2)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'live':
          return 'rgba(92, 157, 255, 0.16)';
        case 'ok':
          return 'rgba(47, 208, 127, 0.12)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.12)';
        case 'error':
          return 'rgba(255, 102, 117, 0.12)';
        default:
          return 'rgba(139, 160, 204, 0.12)';
      }
    }};
  font-size: 13px;
  font-weight: 700;
  color: #f4f8ff;
  white-space: nowrap;
`;

const LiveDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--blue);
  box-shadow: 0 0 16px rgba(92, 157, 255, 0.86);
`;

const AutoRunButton = styled.button<{ $active: boolean }>`
  ${buttonReset};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(92, 157, 255, 0.38)' : 'rgba(139, 160, 204, 0.2)')};
  background: ${({ $active }) => ($active ? 'rgba(92, 157, 255, 0.16)' : 'rgba(18, 31, 57, 0.9)')};
  font-size: 13px;
  font-weight: 700;
  color: #f5f9ff;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.18);
  }
`;

const DashboardGrid = styled.section`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr) 390px;
  gap: 18px;
  min-height: 0;
  height: 100%;
  overflow: hidden;

  @media (max-width: 1520px) {
    grid-template-columns: 300px minmax(0, 1fr) 350px;
  }

  @media (max-width: 1320px) {
    grid-template-columns: 280px minmax(0, 1fr) 320px;
  }
`;

const LeftColumn = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: 18px;
  min-height: 0;
`;

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 20px;
  border-radius: 26px;
  border: 1px solid rgba(139, 160, 204, 0.14);
  background: linear-gradient(180deg, rgba(12, 23, 44, 0.96) 0%, rgba(8, 16, 31, 0.96) 100%);
  box-shadow:
    0 20px 54px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  overflow: hidden;
`;

const CenterPanel = styled(Panel)``;

const RightPanel = styled(Panel)``;

const PanelTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  flex-shrink: 0;
`;

const PanelTitleGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
`;

const PanelCaption = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: #99add6;
`;

const PanelBodyScroll = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-right: 2px;
`;

const RingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 0;
  padding: 4px 0 10px;
`;

const RingInner = styled.div`
  position: relative;
  width: 224px;
  height: 224px;
`;

const RingSvg = styled.svg`
  width: 224px;
  height: 224px;
  transform: rotate(-90deg);
`;

const RingTrack = styled.circle`
  fill: none;
  stroke: rgba(99, 119, 159, 0.22);
  stroke-width: 16;
`;

const RingValue = styled.circle<{ $percent: number; $tone: RingTone }>`
  fill: none;
  stroke:
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'var(--ok)';
        case 'warning':
          return 'var(--warning)';
        case 'error':
          return 'var(--error)';
        default:
          return 'var(--blue)';
      }
    }};
  stroke-width: 16;
  stroke-linecap: round;
  stroke-dasharray: ${CIRCLE_CIRCUMFERENCE};
  stroke-dashoffset: ${({ $percent }) => CIRCLE_CIRCUMFERENCE - (CIRCLE_CIRCUMFERENCE * $percent) / 100};
  transition:
    stroke-dashoffset 800ms cubic-bezier(0.22, 1, 0.36, 1),
    stroke 180ms ease;
  filter:
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'drop-shadow(0 0 18px rgba(47, 208, 127, 0.28))';
        case 'warning':
          return 'drop-shadow(0 0 18px rgba(255, 190, 85, 0.24))';
        case 'error':
          return 'drop-shadow(0 0 18px rgba(255, 102, 117, 0.24))';
        default:
          return 'drop-shadow(0 0 18px rgba(92, 157, 255, 0.24))';
      }
    }};
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
  font-size: 54px;
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 1;
`;

const RingLabel = styled.div`
  font-size: 13px;
  line-height: 1.6;
  color: #9fb4de;
`;

const QuickStatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 4px;
`;

const QuickStatCard = styled.div`
  padding: 14px 15px;
  border-radius: 18px;
  border: 1px solid rgba(139, 160, 204, 0.12);
  background: rgba(18, 33, 61, 0.82);
`;

const QuickStatLabel = styled.div`
  font-size: 12px;
  color: #86a0d1;
`;

const QuickStatValue = styled.div`
  margin-top: 8px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
`;

const SlotList = styled.div`
  display: grid;
  gap: 10px;
`;

const SlotButton = styled.button<{ $active: boolean }>`
  ${buttonReset};
  position: relative;
  display: grid;
  gap: 4px;
  padding: 16px 16px 16px 20px;
  border-radius: 18px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(92, 157, 255, 0.42)' : 'rgba(139, 160, 204, 0.12)')};
  background: ${({ $active }) => ($active ? 'rgba(92, 157, 255, 0.14)' : 'rgba(18, 33, 61, 0.74)')};
  text-align: left;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;

  &::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 10px;
    bottom: 10px;
    width: 4px;
    border-radius: 999px;
    background: ${({ $active }) => ($active ? 'var(--blue)' : 'transparent')};
    box-shadow: ${({ $active }) => ($active ? '0 0 12px rgba(92, 157, 255, 0.55)' : 'none')};
  }

  &:hover {
    transform: translateX(2px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
  }
`;

const SlotRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
`;

const SlotTime = styled.div`
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1.05;
`;

const SlotCaption = styled.div`
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.6;
  color: #8ea4d0;
`;

const SlotSide = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

const SlotMetaPill = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(139, 160, 204, 0.16);
  background: rgba(10, 18, 33, 0.34);
  font-size: 11px;
  font-weight: 700;
  color: #d7e4ff;
  white-space: nowrap;
`;

const SlotIndicator = styled.div<{ $active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? 'var(--blue)' : 'rgba(122, 140, 181, 0.32)')};
  box-shadow: ${({ $active }) => ($active ? '0 0 16px rgba(92, 157, 255, 0.6)' : 'none')};
`;

const LineHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
  flex-shrink: 0;
`;

const LineHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const MiniPill = styled.div<{ $tone: 'ok' | 'warning' | 'error' | 'neutral' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(47, 208, 127, 0.24)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.24)';
        case 'error':
          return 'rgba(255, 102, 117, 0.24)';
        default:
          return 'rgba(139, 160, 204, 0.18)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(47, 208, 127, 0.1)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.1)';
        case 'error':
          return 'rgba(255, 102, 117, 0.1)';
        default:
          return 'rgba(18, 33, 61, 0.82)';
      }
    }};
  font-size: 12px;
  font-weight: 700;
  color: #eef4ff;
  white-space: nowrap;
`;

const CenterBody = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 16px;
  overflow: hidden;
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
  grid-template-columns: 118px minmax(0, 1fr) 168px;
  align-items: center;
  gap: 18px;
  padding: 18px 20px;
  border-radius: 24px;
  border: 1px solid ${({ $selected }) => ($selected ? 'rgba(92, 157, 255, 0.34)' : 'rgba(139, 160, 204, 0.12)')};
  background: ${({ $selected }) => ($selected ? 'rgba(21, 40, 74, 0.94)' : 'rgba(14, 26, 48, 0.78)')};
  box-shadow: ${({ $selected }) => ($selected ? '0 18px 36px rgba(0, 0, 0, 0.24)' : 'none')};
  transition:
    border-color 160ms ease,
    background 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;

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
  letter-spacing: -0.04em;
`;

const LineShift = styled.div`
  font-size: 12px;
  line-height: 1.5;
  color: #8ea4d0;
`;

const NodeRail = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  min-width: 0;
`;

const NodeTrack = styled.div`
  position: absolute;
  top: 26px;
  left: 7%;
  right: 7%;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(93, 121, 171, 0.18) 0%, rgba(93, 121, 171, 0.4) 100%);
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
  width: 56px;
  height: 56px;
  border-radius: 999px;
  border: 2px solid
    ${({ $status }) => {
      switch ($status) {
        case 'ok':
          return 'rgba(47, 208, 127, 0.46)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.52)';
        case 'error':
          return 'rgba(255, 102, 117, 0.54)';
        case 'idle':
          return 'rgba(139, 160, 204, 0.22)';
        default:
          return 'rgba(139, 160, 204, 0.22)';
      }
    }};
  background:
    ${({ $status }) => {
      switch ($status) {
        case 'ok':
          return 'linear-gradient(180deg, rgba(47, 208, 127, 0.24) 0%, rgba(22, 86, 55, 0.7) 100%)';
        case 'warning':
          return 'linear-gradient(180deg, rgba(255, 190, 85, 0.24) 0%, rgba(120, 77, 22, 0.7) 100%)';
        case 'error':
          return 'linear-gradient(180deg, rgba(255, 102, 117, 0.24) 0%, rgba(124, 37, 49, 0.72) 100%)';
        case 'idle':
          return 'linear-gradient(180deg, rgba(139, 160, 204, 0.12) 0%, rgba(31, 47, 75, 0.74) 100%)';
        default:
          return 'linear-gradient(180deg, rgba(139, 160, 204, 0.12) 0%, rgba(31, 47, 75, 0.74) 100%)';
      }
    }};
  font-size: 17px;
  font-weight: 800;
  color: #ffffff;
  box-shadow:
    ${({ $selected }) => ($selected ? '0 0 0 7px rgba(92, 157, 255, 0.14), 0 10px 24px rgba(0, 0, 0, 0.2)' : '0 10px 20px rgba(0, 0, 0, 0.14)')};
  ${({ $selected }) =>
    $selected
      ? css`
          animation: ${pulse} 2.1s infinite;
        `
      : 'animation: none;'}
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const NodeLabel = styled.div<{ $selected: boolean }>`
  width: 64px;
  font-size: 11px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 600)};
  color: ${({ $selected }) => ($selected ? '#eef4ff' : '#87a0cc')};
  text-align: center;
  line-height: 1.45;
`;

const LineSummary = styled.div`
  display: grid;
  gap: 8px;
  justify-items: end;
`;

const SummaryPill = styled.div<{ $tone: 'ok' | 'warning' | 'error' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  min-width: 84px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(47, 208, 127, 0.24)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.24)';
        case 'error':
          return 'rgba(255, 102, 117, 0.24)';
        default:
          return 'rgba(139, 160, 204, 0.18)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(47, 208, 127, 0.1)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.1)';
        case 'error':
          return 'rgba(255, 102, 117, 0.1)';
        default:
          return 'rgba(139, 160, 204, 0.1)';
      }
    }};
  font-size: 11px;
  font-weight: 700;
  color: #eef4ff;
`;

const DetailCard = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(280px, 0.82fr);
  gap: 16px;
  padding: 18px;
  border-radius: 24px;
  border: 1px solid rgba(139, 160, 204, 0.12);
  background: linear-gradient(180deg, rgba(10, 18, 34, 0.95) 0%, rgba(14, 26, 48, 0.9) 100%);
  max-height: 330px;
  overflow: auto;

  @media (max-width: 1460px) {
    grid-template-columns: 1fr;
  }
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
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7f95c0;
`;

const DetailTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
`;

const StatusBadge = styled.div<{ $status: CheckpointStatus }>`
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ $status }) => {
      switch ($status) {
        case 'ok':
          return 'rgba(47, 208, 127, 0.26)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.26)';
        case 'error':
          return 'rgba(255, 102, 117, 0.26)';
        case 'idle':
          return 'rgba(139, 160, 204, 0.18)';
        default:
          return 'rgba(139, 160, 204, 0.18)';
      }
    }};
  background:
    ${({ $status }) => {
      switch ($status) {
        case 'ok':
          return 'rgba(47, 208, 127, 0.12)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.12)';
        case 'error':
          return 'rgba(255, 102, 117, 0.12)';
        case 'idle':
          return 'rgba(139, 160, 204, 0.1)';
        default:
          return 'rgba(139, 160, 204, 0.1)';
      }
    }};
  font-size: 12px;
  font-weight: 700;
  color: #eef3ff;
  white-space: nowrap;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const DetailMetric = styled.div`
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(139, 160, 204, 0.1);
  background: rgba(18, 33, 61, 0.76);
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
  border: 1px solid rgba(139, 160, 204, 0.1);
  background: rgba(18, 33, 61, 0.68);
  font-size: 14px;
  line-height: 1.7;
  color: #a8bbdf;
`;

const ActionPanel = styled.div`
  display: grid;
  align-content: space-between;
  gap: 18px;
`;

const ActionTitle = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #eef4ff;
`;

const ActionDescription = styled.div`
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.75;
  color: #96abd6;
`;

const ActionButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;

const StatusActionButton = styled.button<{ $tone: 'ok' | 'warning' | 'error' }>`
  ${buttonReset};
  min-height: 54px;
  border-radius: 16px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(47, 208, 127, 0.3)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.3)';
        case 'error':
          return 'rgba(255, 102, 117, 0.3)';
        default:
          return 'rgba(139, 160, 204, 0.18)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(47, 208, 127, 0.14)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.14)';
        case 'error':
          return 'rgba(255, 102, 117, 0.14)';
        default:
          return 'rgba(18, 33, 61, 0.7)';
      }
    }};
  font-size: 14px;
  font-weight: 700;
  color: #f7fbff;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.16);
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 14px;
  flex-shrink: 0;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  ${buttonReset};
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(92, 157, 255, 0.36)' : 'rgba(139, 160, 204, 0.16)')};
  background: ${({ $active }) => ($active ? 'rgba(92, 157, 255, 0.14)' : 'rgba(18, 33, 61, 0.8)')};
  font-size: 12px;
  font-weight: 700;
  color: #eef3ff;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }
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
  background: rgba(139, 160, 204, 0.18);
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
          return 'var(--ok)';
        case 'warning':
          return 'var(--warning)';
        case 'error':
          return 'var(--error)';
        default:
          return 'var(--blue)';
      }
    }};
  box-shadow:
    ${({ $level }) => {
      switch ($level) {
        case 'ok':
          return '0 0 14px rgba(47, 208, 127, 0.6)';
        case 'warning':
          return '0 0 14px rgba(255, 190, 85, 0.56)';
        case 'error':
          return '0 0 14px rgba(255, 102, 117, 0.56)';
        default:
          return '0 0 14px rgba(92, 157, 255, 0.56)';
      }
    }};
`;

const TimelineCardButton = styled.button<{ $focused: boolean }>`
  ${buttonReset};
  display: grid;
  gap: 8px;
  width: 100%;
  padding: 15px 16px;
  border-radius: 18px;
  border: 1px solid ${({ $focused }) => ($focused ? 'rgba(92, 157, 255, 0.32)' : 'rgba(139, 160, 204, 0.12)')};
  background: ${({ $focused }) => ($focused ? 'rgba(20, 40, 74, 0.94)' : 'rgba(18, 33, 61, 0.8)')};
  text-align: left;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.14);
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
          return 'rgba(47, 208, 127, 0.26)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.26)';
        case 'error':
          return 'rgba(255, 102, 117, 0.26)';
        default:
          return 'rgba(139, 160, 204, 0.18)';
      }
    }};
  background:
    ${({ $level }) => {
      switch ($level) {
        case 'ok':
          return 'rgba(47, 208, 127, 0.1)';
        case 'warning':
          return 'rgba(255, 190, 85, 0.1)';
        case 'error':
          return 'rgba(255, 102, 117, 0.1)';
        default:
          return 'rgba(18, 33, 61, 0.76)';
      }
    }};
  font-size: 11px;
  font-weight: 700;
  color: #eef3ff;
  white-space: nowrap;
`;

const TimelineDetail = styled.div`
  font-size: 13px;
  line-height: 1.72;
  color: #a7b9dc;
`;

const TimelineMeta = styled.div`
  font-size: 12px;
  line-height: 1.6;
  color: #7f95c0;
`;

const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 240px;
  padding: 20px;
  border-radius: 20px;
  border: 1px dashed rgba(139, 160, 204, 0.18);
  background: rgba(18, 33, 61, 0.46);
  text-align: center;
  font-size: 14px;
  line-height: 1.8;
  color: #8ea4d0;
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

  const completionTone = useMemo<RingTone>(() => {
    if (completionRate >= 82) {
      return 'ok';
    }

    if (completionRate >= 64) {
      return 'warning';
    }

    return 'error';
  }, [completionRate]);

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

  const slotLogCounts = useMemo(() => {
    return state.logs.reduce<Record<string, number>>((acc, log) => {
      acc[log.slotId] = (acc[log.slotId] ?? 0) + 1;
      return acc;
    }, {});
  }, [state.logs]);

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
    <>
      <GlobalStyle />
      <PageShell>
        <HeaderBar>
          <TitleBlock>
            <Eyebrow>smart factory control center</Eyebrow>
            <MainTitle>공정 점검 통합 대시보드</MainTitle>
            <SubText>
              생산 라인 상태, 시간대별 점검 스케줄, 이슈 로그를 한 화면에서 선명하게 확인하도록
              구조를 재정리했습니다. 전체 높이는 100vh 안에서 고정되고, 넘치는 정보는 각 패널 내부에서만
              스크롤됩니다.
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
                  <PanelTitle>전체 공정 진행 상태</PanelTitle>
                  <PanelCaption>가중치 기반 완료율과 주요 상태 수치를 한 번에 확인할 수 있습니다.</PanelCaption>
                </PanelTitleGroup>
              </PanelTop>

              <PanelBodyScroll>
                <RingWrap>
                  <RingInner>
                    <RingSvg viewBox="0 0 224 224">
                      <RingTrack cx="112" cy="112" r={CIRCLE_RADIUS} />
                      <RingValue cx="112" cy="112" r={CIRCLE_RADIUS} $percent={completionRate} $tone={completionTone} />
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
                    <QuickStatLabel>정상 스텝</QuickStatLabel>
                    <QuickStatValue>{okCount}개</QuickStatValue>
                  </QuickStatCard>
                  <QuickStatCard>
                    <QuickStatLabel>주의 스텝</QuickStatLabel>
                    <QuickStatValue>{warningCount}개</QuickStatValue>
                  </QuickStatCard>
                  <QuickStatCard>
                    <QuickStatLabel>중단 스텝</QuickStatLabel>
                    <QuickStatValue>{errorCount}개</QuickStatValue>
                  </QuickStatCard>
                  <QuickStatCard>
                    <QuickStatLabel>선택 시간대</QuickStatLabel>
                    <QuickStatValue>{selectedTimeSlot?.label}</QuickStatValue>
                  </QuickStatCard>
                </QuickStatGrid>
              </PanelBodyScroll>
            </Panel>

            <Panel>
              <PanelTop>
                <PanelTitleGroup>
                  <PanelTitle>시간대별 점검 관람</PanelTitle>
                  <PanelCaption>시간대를 바꾸면 로그와 수동 변경 기준이 함께 전환됩니다.</PanelCaption>
                </PanelTitleGroup>
              </PanelTop>

              <PanelBodyScroll>
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
                        <div>
                          <SlotTime>{slot.label}</SlotTime>
                          <SlotCaption>{slot.caption}</SlotCaption>
                        </div>
                        <SlotSide>
                          <SlotMetaPill>기록 {slotLogCounts[slot.id] ?? 0}</SlotMetaPill>
                          <SlotIndicator $active={slot.id === state.selectedTimeSlotId} />
                        </SlotSide>
                      </SlotRow>
                    </SlotButton>
                  ))}
                </SlotList>
              </PanelBodyScroll>
            </Panel>
          </LeftColumn>

          <CenterPanel>
            <LineHeaderRow>
              <PanelTitleGroup>
                <PanelTitle>생산 라인 현황</PanelTitle>
                <PanelCaption>
                  라인 또는 스텝을 클릭해서 상세 상태를 확인하고, 아래 액션 버튼으로 즉시 상태를 갱신할 수 있습니다.
                </PanelCaption>
              </PanelTitleGroup>

              <LineHeaderActions>
                <MiniPill $tone="neutral">선택 시간대 · {selectedTimeSlot?.label}</MiniPill>
                <MiniPill $tone="neutral">선택 라인 · {selectedLine?.name}</MiniPill>
              </LineHeaderActions>
            </LineHeaderRow>

            <CenterBody>
              <LinesArea>
                {state.lines.map((line) => (
                  <LineRow key={line.id} $selected={line.id === selectedLine?.id}>
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

                          <NodeLabel $selected={checkpoint.id === selectedCheckpoint?.id}>{checkpoint.label}</NodeLabel>
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

                      <StatusBadge $status={selectedCheckpoint.status}>{getStatusLabel(selectedCheckpoint.status)}</StatusBadge>
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
            </CenterBody>
          </CenterPanel>

          <RightPanel>
            <PanelTop>
              <PanelTitleGroup>
                <PanelTitle>점검 이력</PanelTitle>
                <PanelCaption>시간대와 상태 필터를 조합해서 필요한 기록만 빠르게 추려볼 수 있습니다.</PanelCaption>
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
                        $focused={log.lineId === selectedLine?.id && log.checkpointId === selectedCheckpoint?.id}
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
                          <TimelineBadge $level={log.level}>{getLogLevelLabel(log.level)}</TimelineBadge>
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
    </>
  );
};

export default SmartFactoryDashboard;
