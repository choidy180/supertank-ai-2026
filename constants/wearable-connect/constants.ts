import { ContextMeta, WearableContext, WearableThemeStyle } from "@/types/wearable-connect/types";



export const DEFAULT_NETWORK_PREFIX = '192.168';
export const DEFAULT_SCAN_THIRD_OCTET = '10';
export const DEFAULT_SCAN_START_HOST = '60';
export const DEFAULT_SCAN_END_HOST = '80';
export const DEFAULT_STREAM_PORT = 8080;
export const CONNECTION_TIMEOUT_MS = 3000;
export const MAX_SCAN_COUNT = 40;

export const CONTEXT_META: Record<WearableContext, ContextMeta> = {
  'defect-tracking': {
    badge: '불량역추적',
    title: '불량역추적 웨어러블 연결',
    description:
      '불량 발생 지점의 현장 작업자 웨어러블 스트림을 연결해 조치 상황을 확인합니다.',
    helperText: '불량 조치 현장 카메라 또는 작업자 디바이스를 선택하세요.',
  },
  'no-work': {
    badge: '무작업관리',
    title: '무작업관리 웨어러블 연결',
    description:
      '무작업 알람 발생 위치의 웨어러블 스트림을 연결해 현장 상태를 확인합니다.',
    helperText: '무작업 감지 구역 또는 담당자 디바이스를 선택하세요.',
  },
  timecheck: {
    badge: '타임체크',
    title: '타임체크 웨어러블 연결',
    description:
      '순회 점검자의 웨어러블 스트림을 연결해 타임체크 진행 상황을 확인합니다.',
    helperText: '타임체크 점검자 디바이스를 선택하세요.',
  },
  default: {
    badge: '웨어러블',
    title: '웨어러블 연결',
    description:
      '현장 웨어러블 디바이스의 스트림 상태를 확인하고 연결할 장비를 선택합니다.',
    helperText: '연결 가능한 웨어러블 디바이스를 선택하세요.',
  },
};

export const WEARABLE_THEME_STYLES: Record<'light' | 'dark', WearableThemeStyle> = {
  light: {
    background: '#f5f7fb',
    surface: '#ffffff',
    surfaceMuted: '#f8fafc',
    surfaceHover: '#f1f5f9',
    border: '#e5e7eb',
    borderStrong: '#cbd5e1',
    textPrimary: '#111827',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.08)',
    onAccent: '#ffffff',
    success: '#059669',
    successSoft: 'rgba(5, 150, 105, 0.08)',
    warning: '#d97706',
    warningSoft: 'rgba(217, 119, 6, 0.08)',
    error: '#dc2626',
    errorSoft: 'rgba(220, 38, 38, 0.08)',
    shadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    focus: 'rgba(37, 99, 235, 0.18)',
    overlay: 'rgba(15, 23, 42, 0.52)',
  },
  dark: {
    background: '#0f172a',
    surface: '#111827',
    surfaceMuted: '#1f2937',
    surfaceHover: '#273449',
    border: 'rgba(148, 163, 184, 0.2)',
    borderStrong: 'rgba(148, 163, 184, 0.36)',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    accent: '#93c5fd',
    accentSoft: 'rgba(147, 197, 253, 0.12)',
    onAccent: '#0f172a',
    success: '#86efac',
    successSoft: 'rgba(134, 239, 172, 0.1)',
    warning: '#fcd34d',
    warningSoft: 'rgba(252, 211, 77, 0.1)',
    error: '#fca5a5',
    errorSoft: 'rgba(252, 165, 165, 0.1)',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.16)',
    focus: 'rgba(147, 197, 253, 0.24)',
    overlay: 'rgba(2, 6, 23, 0.72)',
  },
};


export const DEFAULT_TARGET_HOSTS = [
  '192.168.10.65',
  '192.168.10.66',
  '192.168.10.67',
] as const;
