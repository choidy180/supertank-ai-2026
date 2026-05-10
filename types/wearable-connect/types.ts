export type ConnectionStatus = 'idle' | 'checking' | 'ok' | 'error';

export type WearableContext =
  | 'defect-tracking'
  | 'no-work'
  | 'timecheck'
  | 'default';

export type StreamTarget = {
  id: string;
  label: string;
  host: string;
  port: number;
  status: ConnectionStatus;
  lastCheckedAt?: string;
};

export type ContextMeta = {
  badge: string;
  title: string;
  description: string;
  helperText: string;
};

export type WearableThemeStyle = {
  background: string;
  surface: string;
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
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  shadow: string;
  focus: string;
  overlay: string;
};
