export type ActionHistoryContext = 'defect-tracking' | 'no-work';
export type ActionStatus = '발생' | '완료' | 'N/A';
export type ModalStep = 'closed' | 'video';
export type ThemeMode = 'light' | 'dark';

export type DateFilterRange = {
  startDate: string;
  endDate: string;
  startDateTime: string;
  endDateTime: string;
  apiStartDateTime: string;
  apiEndDateTime: string;
};

export type LogItem = {
  id: string;
  title: string;
  desc: string;
  fullLogText: string;
  thumb: string;
  videoTitle: string;
  videoSrc: string;
  videoReady: boolean;
  time: string;
  sttUrl: string;
  textUrl: string;
  raw?: ApiLogItem;
};

export type ActionHistoryItem = {
  id: string;
  context: ActionHistoryContext;
  occurredAt: string;
  completedAt: string;
  durationMinutes: number | null;
  facilityName: string;
  alarmName: string;
  phenomenon: string;
  actionContent: string;
  status: ActionStatus;
  reportTitle: string;
  fullLogText: string;
  videoTitle: string;
  videoSrc: string;
  videoReady: boolean;
  sourceLog: LogItem;
};

export type DateSummaryRow = {
  date: string;
  total: number;
  occurred: number;
  completed: number;
  na: number;
  averageMinutes: number | null;
};

export type DurationSummaryRow = {
  label: string;
  total: number;
  occurred: number;
  completed: number;
  na: number;
};

export type ApiLogItem = {
  IMG_PATH: string;
  LOG_NAME: string;
  STT_NAME: string;
  TIME: string;
  VIDEO_NAME: string;
};

export type LogsApiResponse = {
  data?: ApiLogItem[];
  status?: string;
};

export type SttResponse = {
  config?: {
    dialogs?: {
      speakerText: string;
    }[];
  };
  status: string;
  message?: string;
};

export type NetworkErrorState = {
  detail?: string;
};

export type ActionContextMeta = {
  badge: string;
  title: string;
  description: string;
  primaryLabel: string;
  emptyText: string;
  reportButtonLabel: string;
  reportTitle: string;
  filePrefix: string;
  searchPlaceholder: string;
};

export type ActionHistoryThemeStyle = {
  colorScheme: ThemeMode;
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceMuted: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentSoft: string;
  onAccent: string;
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  warning: string;
  warningSoft: string;
  shadow: string;
  shadowStrong: string;
  focus: string;
  overlay: string;
  skeleton: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;
};
