export type SummaryTone = 'incident' | 'processing' | 'done';
export type SegmentTone = 'blue' | 'cyan' | 'green' | 'slate';
export type HistoryTone = 'incident' | 'processing' | 'done';

export interface SummaryCard {
  id: string;
  label: string;
  value: number;
  caption: string;
  icon: string;
  tone: SummaryTone;
}

export interface DefectTypeStat {
  id: string;
  label: string;
  value: number;
  tone: SegmentTone;
}

export interface RepairTimeStat {
  id: string;
  label: string;
  hours: number;
}

export interface RepairHistoryItem {
  id: string;
  time: string;
  title: string;
  worker: string;
  action: string;
  detail: string;
  tone: HistoryTone;
}
