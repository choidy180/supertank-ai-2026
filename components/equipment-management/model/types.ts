export type ActionStatus = 'incident' | 'processing' | 'done';
export type FilterType = 'all' | ActionStatus;
export type DowntimeTone = 'critical' | 'warning' | 'info';

export interface LiveSummary {
  incident: number;
  processing: number;
  done: number;
}

export interface DowntimeStat {
  id: string;
  name: string;
  downtimeMinutes: number;
  incidents: number;
  availability: number;
  tone: DowntimeTone;
}

export interface ActionHistoryItem {
  id: string;
  date: string;
  time: string;
  equipment: string;
  code: string;
  status: ActionStatus;
  area: string;
  title: string;
  summary: string;
  owner: string;
  impact: string;
  startedAt: string;
  updatedAt: string;
}
