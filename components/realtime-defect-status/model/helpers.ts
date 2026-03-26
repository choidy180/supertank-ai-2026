import type { DefectTypeStat, HistoryTone, SegmentTone, SummaryTone } from './types';

export const formatClock = (date: Date): string => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const getSummaryToneLabel = (tone: SummaryTone): string => {
  switch (tone) {
    case 'incident':
      return '금일 발생';
    case 'processing':
      return '처리 중';
    case 'done':
      return '완료';
    default:
      return tone;
  }
};

export const getHistoryToneLabel = (tone: HistoryTone): string => {
  switch (tone) {
    case 'incident':
      return '긴급';
    case 'processing':
      return '진행';
    case 'done':
      return '완료';
    default:
      return tone;
  }
};

export const getToneColor = (tone: SegmentTone | SummaryTone | HistoryTone): string => {
  switch (tone) {
    case 'incident':
      return '#ff6b86';
    case 'processing':
      return '#66a8ff';
    case 'done':
      return '#2dd6a0';
    case 'blue':
      return '#4b92ff';
    case 'cyan':
      return '#4fd3ff';
    case 'green':
      return '#2fd68f';
    case 'slate':
      return '#6e86b1';
    default:
      return '#4b92ff';
  }
};

export const getTotalDefectValue = (items: DefectTypeStat[]): number => {
  return items.reduce((sum, item) => sum + item.value, 0);
};

export const getLargestDefect = (items: DefectTypeStat[]): DefectTypeStat => {
  return items.reduce((prev, current) => {
    return current.value > prev.value ? current : prev;
  }, items[0]);
};

export const formatHours = (value: number): string => {
  if (Number.isInteger(value)) {
    return `${value}h`;
  }

  return `${value.toFixed(1)}h`;
};
