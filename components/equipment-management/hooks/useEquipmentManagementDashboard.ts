'use client';

import { useEffect, useMemo, useState } from 'react';
import { ACTION_HISTORY, DOWNTIME_STATS, LIVE_SUMMARY } from '../model/constants';
import { FilterType } from '../model/types';

export const useEquipmentManagementDashboard = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedId, setSelectedId] = useState<string>(ACTION_HISTORY[0]?.id ?? '');
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const visibleHistory = useMemo(() => {
    if (filter === 'all') {
      return ACTION_HISTORY;
    }

    return ACTION_HISTORY.filter((item) => item.status === filter);
  }, [filter]);

  const selectedHistory = useMemo(() => {
    return visibleHistory.find((item) => item.id === selectedId) ?? visibleHistory[0] ?? ACTION_HISTORY[0] ?? null;
  }, [selectedId, visibleHistory]);

  useEffect(() => {
    if (!visibleHistory.some((item) => item.id === selectedId) && visibleHistory[0]) {
      setSelectedId(visibleHistory[0].id);
    }
  }, [selectedId, visibleHistory]);

  const maxDowntime = useMemo(() => {
    return Math.max(...DOWNTIME_STATS.map((item) => item.downtimeMinutes));
  }, []);

  const topDowntime = useMemo(() => {
    return DOWNTIME_STATS.reduce((prev, current) => {
      return current.downtimeMinutes > prev.downtimeMinutes ? current : prev;
    }, DOWNTIME_STATS[0]);
  }, []);

  const averageAvailability = useMemo(() => {
    const total = DOWNTIME_STATS.reduce((sum, item) => sum + item.availability, 0);
    return (total / DOWNTIME_STATS.length).toFixed(1);
  }, []);

  return {
    summary: LIVE_SUMMARY,
    downtimeStats: DOWNTIME_STATS,
    actionHistory: ACTION_HISTORY,
    visibleHistory,
    selectedHistory,
    maxDowntime,
    topDowntime,
    averageAvailability,
    now,
    filter,
    actions: {
      setFilter,
      setSelectedId
    }
  };
};
