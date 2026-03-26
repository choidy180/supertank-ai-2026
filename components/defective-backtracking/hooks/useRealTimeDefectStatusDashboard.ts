import { useEffect, useMemo, useState } from 'react';
import {
  DEFECT_TYPE_STATS,
  REPAIR_HISTORY,
  REPAIR_TIME_STATS,
  SUMMARY_CARDS
} from '../model/constants';
import {
  getMaxRepairHour,
  getSelectedHistory,
  getTotalDefectTypeValue
} from '../model/helpers';

export const useRealTimeDefectStatusDashboard = () => {
  const [now, setNow] = useState<Date>(new Date());
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>(REPAIR_HISTORY[0]?.id ?? '');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const totalDefectValue = useMemo(() => {
    return getTotalDefectTypeValue(DEFECT_TYPE_STATS);
  }, []);

  const maxRepairHour = useMemo(() => {
    return getMaxRepairHour(REPAIR_TIME_STATS);
  }, []);

  const selectedHistory = useMemo(() => {
    return getSelectedHistory(REPAIR_HISTORY, selectedHistoryId);
  }, [selectedHistoryId]);

  return {
    summaryCards: SUMMARY_CARDS,
    defectTypeStats: DEFECT_TYPE_STATS,
    repairTimeStats: REPAIR_TIME_STATS,
    repairHistory: REPAIR_HISTORY,
    totalDefectValue,
    maxRepairHour,
    now,
    selectedHistory,
    selectedHistoryId,
    actions: {
      selectHistory: setSelectedHistoryId
    }
  };
};
