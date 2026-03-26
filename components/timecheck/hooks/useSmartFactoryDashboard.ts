import { useEffect, useMemo, useReducer } from 'react';

import { TIME_SLOTS, initialState } from '../model/constants';
import {
  calculateCompletionRate,
  countStatus
} from '../model/helpers';
import { dashboardReducer } from '../model/reducer';
import type {
  ActiveCheckpointStatus,
  LogFilter
} from '../model/types';

export const useSmartFactoryDashboard = () => {
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

  const actions = {
    toggleAutoRun: () => {
      dispatch({
        type: 'toggle-auto-run'
      });
    },
    selectLine: (lineId: string) => {
      dispatch({
        type: 'select-line',
        lineId
      });
    },
    selectCheckpoint: (lineId: string, checkpointId: string) => {
      dispatch({
        type: 'select-checkpoint',
        lineId,
        checkpointId
      });
    },
    selectTimeSlot: (slotId: string) => {
      dispatch({
        type: 'select-time-slot',
        slotId
      });
    },
    setLogFilter: (filter: LogFilter) => {
      dispatch({
        type: 'set-log-filter',
        filter
      });
    },
    manualUpdate: (
      lineId: string,
      checkpointId: string,
      status: ActiveCheckpointStatus
    ) => {
      dispatch({
        type: 'manual-update',
        lineId,
        checkpointId,
        status
      });
    }
  };

  return {
    state,
    timeSlots: TIME_SLOTS,
    selectedLine,
    selectedCheckpoint,
    selectedTimeSlot,
    completionRate,
    okCount,
    warningCount,
    errorCount,
    visibleLogs,
    actions
  };
};
