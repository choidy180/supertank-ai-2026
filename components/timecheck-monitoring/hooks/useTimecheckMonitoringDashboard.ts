'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  DAILY_PROGRESS,
  DEFECT_PREDICTION_CARD,
  FIRE_SAFETY_CARD,
  ISSUE_ITEMS,
  MATERIAL_INBOUND_CARD,
  SCANNER_INFO,
  SYSTEM_LOGS,
  TIMECHECK_HISTORY
} from '../model/constants';
import { formatElapsed } from '../model/helpers';

export const useTimecheckMonitoringDashboard = () => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [elapsedSeconds, setElapsedSeconds] = useState(4 * 60 + 12);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>(TIMECHECK_HISTORY[0]?.id ?? '');
  const logScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!autoScroll || !logScrollRef.current) {
      return;
    }

    logScrollRef.current.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [autoScroll]);

  const selectedHistory = useMemo(() => {
    return TIMECHECK_HISTORY.find((item) => item.id === selectedHistoryId) ?? TIMECHECK_HISTORY[0] ?? null;
  }, [selectedHistoryId]);

  return {
    scannerInfo: SCANNER_INFO,
    systemLogs: SYSTEM_LOGS,
    materialInboundCard: MATERIAL_INBOUND_CARD,
    fireSafetyCard: FIRE_SAFETY_CARD,
    defectPredictionCard: DEFECT_PREDICTION_CARD,
    timecheckHistory: TIMECHECK_HISTORY,
    dailyProgress: DAILY_PROGRESS,
    issueItems: ISSUE_ITEMS,
    autoScroll,
    toggleAutoScroll: () => setAutoScroll((prev) => !prev),
    elapsedLabel: formatElapsed(elapsedSeconds),
    logScrollRef,
    selectedHistory,
    selectedHistoryId,
    selectHistory: setSelectedHistoryId
  };
};
