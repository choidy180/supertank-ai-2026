export type SummaryCardIcon = 'trend' | 'gear' | 'check';
export type HistoryIcon = 'wrench' | 'sensor' | 'note';

export interface SummaryCardData {
  id: string;
  label: string;
  value: number;
  icon: SummaryCardIcon;
}

export interface DefectTypeStat {
  id: string;
  label: string;
  value: number;
  color: string;
}

export interface RepairTimeStat {
  id: string;
  label: string;
  hours: number;
  tone?: string; // ✅ 물음표(?)를 붙여서 "없어도 괜찮음"으로 변경
}

export interface RepairHistoryItem {
  id: string;
  time: string;
  title: string;
  worker: string;
  action: string;
  icon: HistoryIcon;
}
