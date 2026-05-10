'use client';

import { createGlobalStyle, css } from 'styled-components';

import { useThemeStore } from '@/store/useThemeStore';
import type { ActionHistoryThemeStyle, ThemeMode } from '../model/types';

const ACTION_HISTORY_THEME_STYLES: Record<ThemeMode, ActionHistoryThemeStyle> = {
  light: {
    colorScheme: 'light',
    background: '#f7f8fa',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    surfaceMuted: '#f8fafc',
    surfaceHover: '#f1f5f9',
    border: '#e5e7eb',
    borderStrong: '#cbd5e1',
    textPrimary: '#111827',
    textSecondary: '#475569',
    textTertiary: '#94a3b8',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.08)',
    onAccent: '#ffffff',
    success: '#16a34a',
    successSoft: 'rgba(22, 163, 74, 0.08)',
    danger: '#ef4444',
    dangerSoft: 'rgba(239, 68, 68, 0.08)',
    warning: '#f59e0b',
    warningSoft: 'rgba(245, 158, 11, 0.10)',
    shadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    shadowStrong: '0 12px 32px rgba(15, 23, 42, 0.12)',
    focus: 'rgba(37, 99, 235, 0.18)',
    overlay: 'rgba(15, 23, 42, 0.52)',
    skeleton: '#e5e7eb',
    scrollbarThumb: 'rgba(148, 163, 184, 0.38)',
    scrollbarThumbHover: 'rgba(100, 116, 139, 0.5)',
  },
  dark: {
    colorScheme: 'dark',
    background: '#141414',
    surface: '#181818',
    surfaceElevated: '#181818',
    surfaceMuted: '#1d1d1d',
    surfaceHover: '#222222',
    border: '#2a2a2a',
    borderStrong: '#3a3a3a',
    textPrimary: '#f5f5f5',
    textSecondary: '#d4d4d4',
    textTertiary: '#8a8a8a',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.16)',
    onAccent: '#ffffff',
    success: '#16a34a',
    successSoft: 'rgba(22, 163, 74, 0.16)',
    danger: '#ef4444',
    dangerSoft: 'rgba(239, 68, 68, 0.16)',
    warning: '#f59e0b',
    warningSoft: 'rgba(245, 158, 11, 0.16)',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.28)',
    shadowStrong: '0 18px 48px rgba(0, 0, 0, 0.38)',
    focus: 'rgba(37, 99, 235, 0.28)',
    overlay: 'rgba(0, 0, 0, 0.72)',
    skeleton: '#2a2a2a',
    scrollbarThumb: '#3a3a3a',
    scrollbarThumbHover: '#525252',
  },
};

const getActionHistoryTheme = (isDark: boolean) =>
  isDark ? ACTION_HISTORY_THEME_STYLES.dark : ACTION_HISTORY_THEME_STYLES.light;

const createActionHistoryThemeVars = (theme: ActionHistoryThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --history-bg: ${theme.background};
  --history-surface: ${theme.surface};
  --history-surface-elevated: ${theme.surfaceElevated};
  --history-surface-muted: ${theme.surfaceMuted};
  --history-surface-hover: ${theme.surfaceHover};

  --history-border: ${theme.border};
  --history-border-strong: ${theme.borderStrong};

  --history-text-primary: ${theme.textPrimary};
  --history-text-secondary: ${theme.textSecondary};
  --history-text-tertiary: ${theme.textTertiary};

  --history-accent: ${theme.accent};
  --history-accent-soft: ${theme.accentSoft};
  --history-on-accent: ${theme.onAccent};

  --history-success: ${theme.success};
  --history-success-soft: ${theme.successSoft};

  --history-danger: ${theme.danger};
  --history-danger-soft: ${theme.dangerSoft};

  --history-warning: ${theme.warning};
  --history-warning-soft: ${theme.warningSoft};

  --history-shadow: ${theme.shadow};
  --history-shadow-strong: ${theme.shadowStrong};
  --history-focus: ${theme.focus};
  --history-overlay: ${theme.overlay};
  --history-skeleton: ${theme.skeleton};

  --history-scrollbar-thumb: ${theme.scrollbarThumb};
  --history-scrollbar-thumb-hover: ${theme.scrollbarThumbHover};
`;

const GlobalBase = createGlobalStyle<{ $isDark: boolean }>`
  :root {
    ${({ $isDark }) => createActionHistoryThemeVars(getActionHistoryTheme($isDark))}
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #__next {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow-x: hidden;
  }

  body {
    margin: 0;
    background: var(--history-bg);
    color: var(--history-text-primary);
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

  img {
    display: block;
    max-width: 100%;
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
    background: var(--history-scrollbar-thumb);
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    border: 2px solid transparent;
    background: var(--history-scrollbar-thumb-hover);
    background-clip: padding-box;
  }

  ::selection {
    background: var(--history-accent-soft);
    color: var(--history-text-primary);
  }
`;

export default function ActionHistoryGlobalStyle() {
  const isDark = useThemeStore((state) => state.isDark);

  return <GlobalBase $isDark={isDark} />;
}
