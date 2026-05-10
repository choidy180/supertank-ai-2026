'use client';

import { createElement } from 'react';
import { createGlobalStyle, css } from 'styled-components';

import { useThemeStore } from '@/store/useThemeStore';

type ThemeMode = 'light' | 'dark';

type MonitorThemeStyle = {
  colorScheme: ThemeMode;

  background: string;
  backgroundMuted: string;

  surface: string;
  surfaceMuted: string;
  surfaceHover: string;
  surfaceSoft: string;
  glass: string;

  border: string;
  borderStrong: string;

  accent: string;
  accentSoft: string;
  cyan: string;
  onAccent: string;
  overlay: string;

  success: string;
  successSoft: string;

  warning: string;
  warningSoft: string;

  error: string;
  errorSoft: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textStrong: string;

  shadow: string;
  shadowStrong: string;
  focus: string;

  scrollbarThumb: string;
  scrollbarThumbHover: string;
};

const MONITOR_THEME_STYLES: Record<ThemeMode, MonitorThemeStyle> = {
  light: {
    colorScheme: 'light',

    background: '#f5f7fb',
    backgroundMuted: '#eef2f7',

    surface: '#ffffff',
    surfaceMuted: '#f8fafc',
    surfaceHover: '#f1f5f9',
    surfaceSoft: '#e5e7eb',
    glass: '#ffffff',

    border: '#e5e7eb',
    borderStrong: '#cbd5e1',

    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.08)',
    cyan: '#2563eb',
    onAccent: '#ffffff',
    overlay: 'rgba(15, 23, 42, 0.52)',

    success: '#16a34a',
    successSoft: 'rgba(22, 163, 74, 0.08)',

    warning: '#f59e0b',
    warningSoft: 'rgba(245, 158, 11, 0.1)',

    error: '#ef4444',
    errorSoft: 'rgba(239, 68, 68, 0.08)',

    textStrong: '#111827',
    textPrimary: '#334155',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',

    shadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    shadowStrong: '0 18px 48px rgba(15, 23, 42, 0.14)',
    focus: 'rgba(37, 99, 235, 0.18)',

    scrollbarThumb: 'rgba(148, 163, 184, 0.38)',
    scrollbarThumbHover: 'rgba(100, 116, 139, 0.5)',
  },

  dark: {
    colorScheme: 'dark',

    background: '#141414',
    backgroundMuted: '#171717',

    surface: '#181818',
    surfaceMuted: '#1d1d1d',
    surfaceHover: '#222222',
    surfaceSoft: '#262626',
    glass: '#181818',

    border: '#2a2a2a',
    borderStrong: '#3a3a3a',

    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.16)',
    cyan: '#2563eb',
    onAccent: '#ffffff',
    overlay: 'rgba(0, 0, 0, 0.68)',

    success: '#16a34a',
    successSoft: 'rgba(22, 163, 74, 0.14)',

    warning: '#f59e0b',
    warningSoft: 'rgba(245, 158, 11, 0.16)',

    error: '#ef4444',
    errorSoft: 'rgba(239, 68, 68, 0.14)',

    textStrong: '#f9fafb',
    textPrimary: '#e5e7eb',
    textSecondary: '#a3a3a3',
    textTertiary: '#737373',

    shadow: '0 1px 2px rgba(0, 0, 0, 0.22)',
    shadowStrong: '0 18px 48px rgba(0, 0, 0, 0.42)',
    focus: 'rgba(37, 99, 235, 0.3)',

    scrollbarThumb: 'rgba(115, 115, 115, 0.48)',
    scrollbarThumbHover: 'rgba(163, 163, 163, 0.58)',
  },
};

const getMonitorTheme = (isDark: boolean) =>
  isDark ? MONITOR_THEME_STYLES.dark : MONITOR_THEME_STYLES.light;

const createMonitorThemeVars = (theme: MonitorThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --monitor-bg: ${theme.background};
  --monitor-bg-2: ${theme.backgroundMuted};

  --monitor-panel: ${theme.surface};
  --monitor-panel-2: ${theme.surfaceMuted};
  --monitor-panel-3: ${theme.surfaceHover};
  --monitor-panel-soft: ${theme.surfaceSoft};
  --monitor-glass: ${theme.glass};

  --monitor-line: ${theme.border};
  --monitor-line-strong: ${theme.borderStrong};

  --monitor-blue: ${theme.accent};
  --monitor-blue-soft: ${theme.accentSoft};
  --monitor-cyan: ${theme.cyan};
  --monitor-on-blue: ${theme.onAccent};
  --monitor-overlay: ${theme.overlay};

  --monitor-green: ${theme.success};
  --monitor-green-soft: ${theme.successSoft};

  --monitor-amber: ${theme.warning};
  --monitor-amber-soft: ${theme.warningSoft};

  --monitor-red: ${theme.error};
  --monitor-red-soft: ${theme.errorSoft};

  --monitor-white: ${theme.textStrong};
  --monitor-text: ${theme.textPrimary};
  --monitor-text-secondary: ${theme.textSecondary};
  --monitor-text-muted: ${theme.textTertiary};

  --monitor-shadow: ${theme.shadow};
  --monitor-shadow-strong: ${theme.shadowStrong};
  --monitor-focus: ${theme.focus};

  --scrollbar-thumb: ${theme.scrollbarThumb};
  --scrollbar-thumb-hover: ${theme.scrollbarThumbHover};

  --color-background: ${theme.background};

  --color-surface: ${theme.surface};
  --color-surface-muted: ${theme.surfaceMuted};
  --color-surface-hover: ${theme.surfaceHover};

  --color-border: ${theme.border};
  --color-border-strong: ${theme.borderStrong};

  --color-text-primary: ${theme.textStrong};
  --color-text-secondary: ${theme.textSecondary};
  --color-text-tertiary: ${theme.textTertiary};

  --color-accent: ${theme.accent};
  --color-accent-soft: ${theme.accentSoft};
  --color-on-accent: ${theme.onAccent};

  --color-success: ${theme.success};
  --color-success-soft: ${theme.successSoft};

  --color-warning: ${theme.warning};
  --color-warning-soft: ${theme.warningSoft};

  --color-error: ${theme.error};
  --color-error-soft: ${theme.errorSoft};

  --color-overlay: ${theme.overlay};
  --color-shadow: ${theme.shadow};
  --color-shadow-strong: ${theme.shadowStrong};
  --color-focus: ${theme.focus};

  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-xl: 16px;

  --transition-fast: 140ms ease;
  --transition-base: 180ms ease;
`;

const GlobalStyleBase = createGlobalStyle<{ $isDark: boolean }>`
  :root {
    ${({ $isDark }) => createMonitorThemeVars(getMonitorTheme($isDark))}
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) transparent;
  }

  html,
  body {
    min-height: 100%;
    margin: 0;
    padding: 0;
    background: var(--color-background);
    color: var(--color-text-primary);
    font-family:
      'Pretendard Variable',
      'Pretendard',
      -apple-system,
      BlinkMacSystemFont,
      'Apple SD Gothic Neo',
      'Noto Sans KR',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body {
    overflow-x: hidden;
  }

  #__next,
  #root {
    min-height: 100%;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button {
    color: inherit;
  }

  button:not(:disabled),
  [role='button']:not([aria-disabled='true']) {
    cursor: pointer;
  }

  :disabled,
  [aria-disabled='true'] {
    cursor: not-allowed;
  }

  input,
  textarea,
  select {
    color: inherit;
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--color-text-tertiary);
  }

  img,
  video,
  canvas,
  svg {
    max-width: 100%;
  }

  :focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }

  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 999px;
    background: var(--scrollbar-thumb);
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
    background-clip: padding-box;
  }

  ::selection {
    background: var(--color-accent-soft);
    color: var(--color-text-primary);
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
`;

export default function GlobalStyle() {
  const isDark = useThemeStore((state) => state.isDark);

  return createElement(GlobalStyleBase, {
    $isDark: isDark,
  });
}
