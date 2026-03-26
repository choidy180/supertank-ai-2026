import type {
  ActiveCheckpointStatus,
  Checkpoint,
  CheckpointStatus,
  InspectionLog,
  LogLevel,
  ProductionLine
} from './types';

export const getStatusLabel = (status: CheckpointStatus): string => {
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

export const getLogLevelLabel = (level: LogLevel): string => {
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

export const getStatusNote = (
  status: CheckpointStatus,
  source: 'manual' | 'auto',
  checkpointLabel: string
): string => {
  const prefix =
    source === 'manual' ? '운영자 수동 갱신' : '실시간 모니터링 갱신';

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

export const createCheckpoint = (
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

export const countStatus = (
  checkpoints: Checkpoint[],
  status: CheckpointStatus
): number => {
  return checkpoints.filter((checkpoint) => checkpoint.status === status).length;
};

export const calculateCompletionRate = (lines: ProductionLine[]): number => {
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

export const randomFrom = <T,>(items: readonly T[]): T => {
  return items[Math.floor(Math.random() * items.length)] as T;
};

export const pickNextStatus = (
  current: CheckpointStatus
): ActiveCheckpointStatus => {
  const pool: ActiveCheckpointStatus[] = [
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
    } else {
      next = 'ok';
    }
  }

  return next;
};

export const formatClock = (date: Date): string => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const createLogEntry = (payload: {
  time: string;
  slotId: string;
  lineId: string;
  lineName: string;
  checkpointId: string;
  checkpointLabel: string;
  level: LogLevel;
  status: ActiveCheckpointStatus;
  inspector: string;
  source: 'manual' | 'auto';
}): InspectionLog => {
  const detailByStatus: Record<ActiveCheckpointStatus, string> = {
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

  const titleByStatus: Record<ActiveCheckpointStatus, string> = {
    ok: `${payload.checkpointLabel} 정상 확인`,
    warning: `${payload.checkpointLabel} 주의 감지`,
    error: `${payload.checkpointLabel} 이상 발생`
  };

  return {
    id: `log-${payload.lineId}-${payload.checkpointId}-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2, 7)}`,
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
