import { ActionStatus, DowntimeTone } from './types';

export const getStatusLabel = (status: ActionStatus): string => {
  switch (status) {
    case 'incident':
      return '발생';
    case 'processing':
      return '조치중';
    case 'done':
      return '완료';
    default:
      return status;
  }
};

export const getStatusDescription = (status: ActionStatus): string => {
  switch (status) {
    case 'incident':
      return '즉시 확인 필요';
    case 'processing':
      return '현장 조치 진행';
    case 'done':
      return '정상 운영 복귀';
    default:
      return status;
  }
};

export const getStatusColor = (status: ActionStatus): string => {
  switch (status) {
    case 'incident':
      return 'var(--red)';
    case 'processing':
      return 'var(--blue)';
    case 'done':
      return 'var(--green)';
    default:
      return 'var(--text-primary)';
  }
};

export const getDowntimeToneLabel = (tone: DowntimeTone): string => {
  switch (tone) {
    case 'critical':
      return '집중 관리';
    case 'warning':
      return '관찰 필요';
    case 'info':
      return '안정';
    default:
      return tone;
  }
};

export const formatMinutes = (minutes: number): string => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  if (hour === 0) {
    return `${minute}분`;
  }

  return `${hour}시간 ${String(minute).padStart(2, '0')}분`;
};

export const formatClock = (date: Date): string => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};
