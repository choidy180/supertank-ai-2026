import type { DefectTypeStat, RepairHistoryItem, RepairTimeStat } from './types';

export const formatPercent = (value: number): string => {
  return `${value}%`;
};

export const formatHourValue = (value: number): string => {
  return Number.isInteger(value) ? `${value}h` : `${value.toFixed(1)}h`;
};

export const getTotalDefectTypeValue = (items: DefectTypeStat[]): number => {
  return items.reduce((sum, item) => sum + item.value, 0);
};

export const getMaxRepairHour = (items: RepairTimeStat[]): number => {
  return items.reduce((max, item) => Math.max(max, item.hours), 0);
};

export const formatClock = (date: Date): string => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const getSelectedHistory = (
  items: RepairHistoryItem[],
  selectedId: string
): RepairHistoryItem | null => {
  return items.find((item) => item.id === selectedId) ?? items[0] ?? null;
};
