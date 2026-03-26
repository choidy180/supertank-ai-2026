import { INSPECTORS } from './constants';
import {
  createLogEntry,
  formatClock,
  getStatusNote,
  pickNextStatus,
  randomFrom
} from './helpers';
import type {
  ActiveCheckpointStatus,
  DashboardAction,
  DashboardState,
  LogLevel
} from './types';

const getLogLevel = (status: ActiveCheckpointStatus): LogLevel => {
  if (status === 'error') {
    return 'error';
  }

  if (status === 'warning') {
    return 'warning';
  }

  return 'ok';
};

const applyStatusUpdate = (
  state: DashboardState,
  payload: {
    lineId: string;
    checkpointId: string;
    status: ActiveCheckpointStatus;
    slotId: string;
    source: 'manual' | 'auto';
  }
): DashboardState => {
  const lineIndex = state.lines.findIndex((line) => line.id === payload.lineId);

  if (lineIndex < 0) {
    return state;
  }

  const targetLine = state.lines[lineIndex];
  const checkpointIndex = targetLine.checkpoints.findIndex(
    (checkpoint) => checkpoint.id === payload.checkpointId
  );

  if (checkpointIndex < 0) {
    return state;
  }

  const targetCheckpoint = targetLine.checkpoints[checkpointIndex];
  const time = formatClock(new Date());
  const inspector =
    payload.source === 'manual'
      ? '운영자 직접 조정'
      : randomFrom(INSPECTORS);

  const updatedCheckpoint = {
    ...targetCheckpoint,
    status: payload.status,
    inspector,
    lastChecked: time,
    note: getStatusNote(payload.status, payload.source, targetCheckpoint.label)
  };

  const updatedLine = {
    ...targetLine,
    checkpoints: targetLine.checkpoints.map((checkpoint, index) => {
      return index === checkpointIndex ? updatedCheckpoint : checkpoint;
    })
  };

  const nextLines = state.lines.map((line, index) => {
    return index === lineIndex ? updatedLine : line;
  });

  const nextLog = createLogEntry({
    time,
    slotId: payload.slotId,
    lineId: targetLine.id,
    lineName: targetLine.name,
    checkpointId: targetCheckpoint.id,
    checkpointLabel: targetCheckpoint.label,
    level: getLogLevel(payload.status),
    status: payload.status,
    inspector,
    source: payload.source
  });

  return {
    ...state,
    lines: nextLines,
    logs: [nextLog, ...state.logs].slice(0, 18),
    selectedLineId: targetLine.id,
    selectedCheckpointId: targetCheckpoint.id
  };
};

export const dashboardReducer = (
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
