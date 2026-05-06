'use client';

import { createElement } from 'react';
import { createGlobalStyle, css } from 'styled-components';

import { useThemeStore } from '@/store/useThemeStore';

type ThemeMode = 'light' | 'dark';

type ThemeStyle = {
  colorScheme: ThemeMode;

  bg0: string;
  bg1: string;
  bg2: string;

  surface1: string;
  surface2: string;
  surface3: string;
  surface4: string;

  lineSoft: string;
  lineStrong: string;

  textStrong: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  blue: string;
  blueSoft: string;

  green: string;
  greenSoft: string;

  amber: string;
  amberSoft: string;

  red: string;
  redSoft: string;

  shadowPanel: string;
  shadowSoft: string;
  focus: string;

  scrollbarThumb: string;
  scrollbarThumbHover: string;
};

const THEME_STYLES: Record<ThemeMode, ThemeStyle> = {
  light: {
    colorScheme: 'light',

    bg0: '#f5f7fb',
    bg1: '#f8fafc',
    bg2: '#eef2f7',

    surface1: '#ffffff',
    surface2: '#f8fafc',
    surface3: '#f1f5f9',
    surface4: '#e5e7eb',

    lineSoft: '#e5e7eb',
    lineStrong: '#cbd5e1',

    textStrong: '#111827',
    textPrimary: '#334155',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',

    blue: '#2563eb',
    blueSoft: 'rgba(37, 99, 235, 0.08)',

    green: '#059669',
    greenSoft: 'rgba(5, 150, 105, 0.08)',

    amber: '#d97706',
    amberSoft: 'rgba(217, 119, 6, 0.08)',

    red: '#dc2626',
    redSoft: 'rgba(220, 38, 38, 0.08)',

    shadowPanel: '0 1px 2px rgba(15, 23, 42, 0.04)',
    shadowSoft: '0 1px 2px rgba(15, 23, 42, 0.03)',
    focus: 'rgba(37, 99, 235, 0.18)',

    scrollbarThumb: 'rgba(148, 163, 184, 0.38)',
    scrollbarThumbHover: 'rgba(100, 116, 139, 0.5)',
  },

  dark: {
    colorScheme: 'dark',

    bg0: '#0f172a',
    bg1: '#111827',
    bg2: '#1f2937',

    surface1: '#111827',
    surface2: '#1f2937',
    surface3: '#273449',
    surface4: '#334155',

    lineSoft: 'rgba(148, 163, 184, 0.2)',
    lineStrong: 'rgba(148, 163, 184, 0.36)',

    textStrong: '#f8fafc',
    textPrimary: '#cbd5e1',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',

    blue: '#93c5fd',
    blueSoft: 'rgba(147, 197, 253, 0.12)',

    green: '#86efac',
    greenSoft: 'rgba(134, 239, 172, 0.1)',

    amber: '#fcd34d',
    amberSoft: 'rgba(252, 211, 77, 0.1)',

    red: '#fca5a5',
    redSoft: 'rgba(252, 165, 165, 0.1)',

    shadowPanel: '0 1px 2px rgba(0, 0, 0, 0.16)',
    shadowSoft: '0 1px 2px rgba(0, 0, 0, 0.12)',
    focus: 'rgba(147, 197, 253, 0.24)',

    scrollbarThumb: 'rgba(148, 163, 184, 0.34)',
    scrollbarThumbHover: 'rgba(203, 213, 225, 0.42)',
  },
};

const getTheme = (isDark: boolean) =>
  isDark ? THEME_STYLES.dark : THEME_STYLES.light;

const createThemeVars = (theme: ThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --bg-0: ${theme.bg0};
  --bg-1: ${theme.bg1};
  --bg-2: ${theme.bg2};

  --surface-1: ${theme.surface1};
  --surface-2: ${theme.surface2};
  --surface-3: ${theme.surface3};
  --surface-4: ${theme.surface4};

  --line-soft: ${theme.lineSoft};
  --line-strong: ${theme.lineStrong};

  --text-strong: ${theme.textStrong};
  --text-primary: ${theme.textPrimary};
  --text-secondary: ${theme.textSecondary};
  --text-muted: ${theme.textMuted};

  --blue: ${theme.blue};
  --blue-soft: ${theme.blueSoft};

  --green: ${theme.green};
  --green-soft: ${theme.greenSoft};

  --amber: ${theme.amber};
  --amber-soft: ${theme.amberSoft};

  --red: ${theme.red};
  --red-soft: ${theme.redSoft};

  --shadow-panel: ${theme.shadowPanel};
  --shadow-soft: ${theme.shadowSoft};
  --focus: ${theme.focus};

  --scrollbar-thumb: ${theme.scrollbarThumb};
  --scrollbar-thumb-hover: ${theme.scrollbarThumbHover};

  --color-background: ${theme.bg0};

  --color-surface: ${theme.surface1};
  --color-surface-muted: ${theme.surface2};
  --color-surface-hover: ${theme.surface3};

  --color-border: ${theme.lineSoft};
  --color-border-strong: ${theme.lineStrong};

  --color-text-primary: ${theme.textStrong};
  --color-text-secondary: ${theme.textSecondary};
  --color-text-tertiary: ${theme.textMuted};

  --color-accent: ${theme.blue};
  --color-accent-soft: ${theme.blueSoft};

  --color-success: ${theme.green};
  --color-success-soft: ${theme.greenSoft};

  --color-warning: ${theme.amber};
  --color-warning-soft: ${theme.amberSoft};

  --color-error: ${theme.red};
  --color-error-soft: ${theme.redSoft};

  --color-shadow: ${theme.shadowPanel};
  --color-focus: ${theme.focus};
`;

const GlobalStyleBase = createGlobalStyle<{ $isDark: boolean }>`
  :root {
    ${({ $isDark }) => createThemeVars(getTheme($isDark))}
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