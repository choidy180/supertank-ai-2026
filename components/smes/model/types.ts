export interface SummaryMetric {
  label: string;
  value: string;
  accent: 'yellow' | 'green' | 'blue';
}

export interface KpiMetric {
  label: string;
  value: string;
  accent: 'blue' | 'cyan' | 'green';
}

export interface QuickMetric {
  label: string;
  value: string;
  accent: 'yellow' | 'white' | 'green' | 'orange';
}

export interface DetailSection {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
}

export interface ProductInfo {
  pNo: string;
  name: string;
  equipment: string;
  startDate: string;
  endDate: string;
  planQty: string;
  statusNote: string;
  phaseLabel: string;
}

export interface StatusTile {
  id: string;
  label: string;
  value: string;
  accent: 'yellow' | 'white' | 'red' | 'green' | 'blue';
  note: string;
}

export interface WorkOrderRow {
  id: string;
  workOrder: string;
  start: string;
  end: string;
  plan: number;
  input: number;
  completed: number;
  defect: number;
}

export interface DowntimeHistoryRow {
  id: string;
  reason: string;
  startTime: string;
  endTime: string;
  stopSeconds: number;
  worker: string;
  grade: '정보' | '주의';
}

export interface LotHistoryRow {
  id: string;
  lotId: string;
  workOrder: string;
  completedAt: string;
  ct: number;
}
