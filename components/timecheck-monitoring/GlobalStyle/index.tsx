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
    cyan: '#0891b2',

    success: '#059669',
    successSoft: 'rgba(5, 150, 105, 0.08)',

    warning: '#d97706',
    warningSoft: 'rgba(217, 119, 6, 0.08)',

    error: '#dc2626',
    errorSoft: 'rgba(220, 38, 38, 0.08)',

    textStrong: '#111827',
    textPrimary: '#334155',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',

    shadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    focus: 'rgba(37, 99, 235, 0.18)',

    scrollbarThumb: 'rgba(148, 163, 184, 0.38)',
    scrollbarThumbHover: 'rgba(100, 116, 139, 0.5)',
  },

  dark: {
    colorScheme: 'dark',

    background: '#0f172a',
    backgroundMuted: '#111827',

    surface: '#111827',
    surfaceMuted: '#1f2937',
    surfaceHover: '#273449',
    surfaceSoft: '#334155',
    glass: '#1f2937',

    border: 'rgba(148, 163, 184, 0.2)',
    borderStrong: 'rgba(148, 163, 184, 0.36)',

    accent: '#93c5fd',
    accentSoft: 'rgba(147, 197, 253, 0.12)',
    cyan: '#67e8f9',

    success: '#86efac',
    successSoft: 'rgba(134, 239, 172, 0.1)',

    warning: '#fcd34d',
    warningSoft: 'rgba(252, 211, 77, 0.1)',

    error: '#fca5a5',
    errorSoft: 'rgba(252, 165, 165, 0.1)',

    textStrong: '#f8fafc',
    textPrimary: '#cbd5e1',
    textSecondary: '#94a3b8',
    textTertiary: '#64748b',

    shadow: '0 1px 2px rgba(0, 0, 0, 0.16)',
    focus: 'rgba(147, 197, 253, 0.24)',

    scrollbarThumb: 'rgba(148, 163, 184, 0.34)',
    scrollbarThumbHover: 'rgba(203, 213, 225, 0.42)',
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

  --color-success: ${theme.success};
  --color-success-soft: ${theme.successSoft};

  --color-warning: ${theme.warning};
  --color-warning-soft: ${theme.warningSoft};

  --color-error: ${theme.error};
  --color-error-soft: ${theme.errorSoft};

  --color-shadow: ${theme.shadow};
  --color-focus: ${theme.focus};
`;

const GlobalStyleBase = createGlobalStyle<{ $isDark: boolean }>`
  :root {
    ${({ $isDark }) => createMonitorThemeVars(getMonitorTheme($isDark))}
  }

  * {
    box-sizing: border-box;
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
    overflow: hidden;
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

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
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
    border: 2px solid transparent;
    background: var(--scrollbar-thumb-hover);
    background-clip: padding-box;
  }

  ::selection {
    background: var(--color-accent-soft);
    color: var(--color-text-primary);
  }
`;

export default function GlobalStyle() {
  const isDark = useThemeStore((state) => state.isDark);

  return createElement(GlobalStyleBase, {
    $isDark: isDark,
  });
}