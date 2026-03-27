export type LogTone = 'blue' | 'green' | 'amber' | 'red' | 'neutral';

export interface ScannerInfo {
  mainViewLabel: string;
  operatorLabel: string;
  statusLabel: string;
  metricLabel: string;
  equipmentName: string;
  completedStep: number;
  totalSteps: number;
  nextCheck: string;
  eta: string;
  sectionTitle: string;
}

export interface SystemLogItem {
  id: string;
  time: string;
  actor: string;
  message: string;
  tone: LogTone;
}

export interface MaterialInboundCardData {
  documentId: string;
  progress: number;
}

export interface FireSafetyCardData {
  zone: string;
  description: string;
}

export interface DefectPredictionCardData {
  title: string;
  confidence: number;
  label: string;
}

export interface HistoryItem {
  id: string;
  time: string;
  equipment: string;
  inspector: string;
  result: string;
  tone: 'green' | 'blue' | 'amber';
}

export interface DailyProgress {
  target: number;
  completed: number;
  percent: number;
}

export interface IssueItem {
  id: string;
  title: string;
  time: string;
  detail: string;
  tone: 'red' | 'amber';
}
