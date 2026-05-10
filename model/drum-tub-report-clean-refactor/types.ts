export type ThemeMode = 'light' | 'dark';

export type CellTone = 'ok' | 'warn' | 'empty' | 'info' | 'danger';

export type ReportThemeStyle = {
  colorScheme: ThemeMode;
  pageBg: string;
  surface: string;
  surfaceSoft: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  onAccent: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  neutralSoft: string;
  shadow: string;
  shadowRaised: string;
  focus: string;
  gridLine: string;
  tableHead: string;
};

export type ReportMeta = {
  title: string;
  subtitle: string;
  documentNo: string;
  lotNo: string;
  model: string;
  line: string;
  inspector: string;
  date: string;
  shift: string;
  revision: string;
};

export type SummaryCard = {
  id: string;
  label: string;
  value: string;
  caption: string;
  tone: CellTone;
};

export type ApprovalStep = {
  label: string;
  name: string;
  role: string;
  status: 'done' | 'waiting';
};

export type ReportRow = {
  id: string;
  group: string;
  item: string;
  spec: string[];
  refs?: string[];
  values: string[];
  memo?: string;
};

export type ReportRowWithMeta = ReportRow & {
  isFirstInGroup: boolean;
  groupSpan: number;
};

export type ActivityLog = {
  id: string;
  time: string;
  title: string;
  desc: string;
  tone: CellTone;
};
