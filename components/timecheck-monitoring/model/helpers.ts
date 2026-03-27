import { LogTone } from './types';

export const formatElapsed = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return [hours, minutes, secs].map((value) => String(value).padStart(2, '0')).join(':');
};

export const getLogToneColor = (tone: LogTone): string => {
  switch (tone) {
    case 'green':
      return 'var(--monitor-green)';
    case 'amber':
      return 'var(--monitor-amber)';
    case 'red':
      return 'var(--monitor-red)';
    case 'blue':
      return 'var(--monitor-blue)';
    default:
      return 'var(--monitor-text-secondary)';
  }
};

export const getHistoryToneColor = (tone: 'green' | 'blue' | 'amber'): string => {
  switch (tone) {
    case 'green':
      return 'var(--monitor-green)';
    case 'amber':
      return 'var(--monitor-amber)';
    default:
      return 'var(--monitor-blue)';
  }
};
