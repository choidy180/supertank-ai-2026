'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DEFECT_TYPE_STATS,
  REPAIR_HISTORY,
  REPAIR_TIME_STATS,
  SUMMARY_CARDS
} from '../model/constants';
import { getLargestDefect, getTotalDefectValue } from '../model/helpers';

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
    return getTotalDefectValue(DEFECT_TYPE_STATS);
  }, []);

  const largestDefect = useMemo(() => {
    return getLargestDefect(DEFECT_TYPE_STATS);
  }, []);

  const maxRepairHour = useMemo(() => {
    return Math.max(...REPAIR_TIME_STATS.map((item) => item.hours));
  }, []);

  const selectedHistory = useMemo(() => {
    return REPAIR_HISTORY.find((item) => item.id === selectedHistoryId) ?? REPAIR_HISTORY[0] ?? null;
  }, [selectedHistoryId]);

  return {
    summaryCards: SUMMARY_CARDS,
    defectTypeStats: DEFECT_TYPE_STATS,
    repairTimeStats: REPAIR_TIME_STATS,
    repairHistory: REPAIR_HISTORY,
    totalDefectValue,
    largestDefect,
    maxRepairHour,
    now,
    selectedHistoryId,
    selectedHistory,
    actions: {
      selectHistory: setSelectedHistoryId
    }
  };
};
