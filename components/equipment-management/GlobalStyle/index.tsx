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
  onBlue: string;

  green: string;
  greenSoft: string;

  amber: string;
  amberSoft: string;

  red: string;
  redSoft: string;

  shadowPanel: string;
  shadowSoft: string;
  focus: string;

  overlay: string;
  selectionBg: string;
  selectionText: string;

  scrollbarThumb: string;
  scrollbarThumbHover: string;
};

const THEME_STYLES: Record<ThemeMode, ThemeStyle> = {
  light: {
    colorScheme: 'light',

    bg0: '#f6f7f9',
    bg1: '#ffffff',
    bg2: '#f3f4f6',

    surface1: '#ffffff',
    surface2: '#f9fafb',
    surface3: '#f3f4f6',
    surface4: '#e5e7eb',

    lineSoft: '#e5e7eb',
    lineStrong: '#d1d5db',

    textStrong: '#111827',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',

    blue: '#2563eb',
    blueSoft: 'rgba(37, 99, 235, 0.08)',
    onBlue: '#ffffff',

    green: '#16a34a',
    greenSoft: 'rgba(22, 163, 74, 0.08)',

    amber: '#f59e0b',
    amberSoft: 'rgba(245, 158, 11, 0.1)',

    red: '#ef4444',
    redSoft: 'rgba(239, 68, 68, 0.08)',

    shadowPanel: '0 1px 2px rgba(15, 23, 42, 0.05)',
    shadowSoft: '0 1px 2px rgba(15, 23, 42, 0.035)',
    focus: 'rgba(37, 99, 235, 0.22)',

    overlay: 'rgba(17, 24, 39, 0.52)',
    selectionBg: '#2563eb',
    selectionText: '#ffffff',

    scrollbarThumb: 'rgba(107, 114, 128, 0.34)',
    scrollbarThumbHover: 'rgba(75, 85, 99, 0.54)',
  },

  dark: {
    colorScheme: 'dark',

    bg0: '#141414',
    bg1: '#181818',
    bg2: '#1d1d1d',

    surface1: '#181818',
    surface2: '#1d1d1d',
    surface3: '#222222',
    surface4: '#2a2a2a',

    lineSoft: '#2a2a2a',
    lineStrong: '#3a3a3a',

    textStrong: '#f5f5f5',
    textPrimary: '#d4d4d4',
    textSecondary: '#a3a3a3',
    textMuted: '#737373',

    blue: '#2563eb',
    blueSoft: 'rgba(37, 99, 235, 0.16)',
    onBlue: '#ffffff',

    green: '#16a34a',
    greenSoft: 'rgba(22, 163, 74, 0.14)',

    amber: '#f59e0b',
    amberSoft: 'rgba(245, 158, 11, 0.16)',

    red: '#ef4444',
    redSoft: 'rgba(239, 68, 68, 0.14)',

    shadowPanel: '0 1px 2px rgba(0, 0, 0, 0.28)',
    shadowSoft: '0 1px 2px rgba(0, 0, 0, 0.2)',
    focus: 'rgba(37, 99, 235, 0.34)',

    overlay: 'rgba(0, 0, 0, 0.68)',
    selectionBg: '#2563eb',
    selectionText: '#ffffff',

    scrollbarThumb: 'rgba(115, 115, 115, 0.42)',
    scrollbarThumbHover: 'rgba(163, 163, 163, 0.58)',
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
  --on-blue: ${theme.onBlue};

  --green: ${theme.green};
  --green-soft: ${theme.greenSoft};

  --amber: ${theme.amber};
  --amber-soft: ${theme.amberSoft};

  --red: ${theme.red};
  --red-soft: ${theme.redSoft};

  --shadow-panel: ${theme.shadowPanel};
  --shadow-soft: ${theme.shadowSoft};
  --focus: ${theme.focus};

  --overlay: ${theme.overlay};
  --selection-bg: ${theme.selectionBg};
  --selection-text: ${theme.selectionText};

  --scrollbar-thumb: ${theme.scrollbarThumb};
  --scrollbar-thumb-hover: ${theme.scrollbarThumbHover};

  /* Existing project aliases */
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
  --color-on-accent: ${theme.onBlue};

  --color-success: ${theme.green};
  --color-success-soft: ${theme.greenSoft};

  --color-warning: ${theme.amber};
  --color-warning-soft: ${theme.amberSoft};

  --color-error: ${theme.red};
  --color-error-soft: ${theme.redSoft};

  --color-shadow: ${theme.shadowPanel};
  --color-focus: ${theme.focus};
  --color-overlay: ${theme.overlay};

  /* Shared shape / motion tokens */
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
    ${({ $isDark }) => createThemeVars(getTheme($isDark))}
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
    background: var(--color-background);
    scrollbar-color: var(--scrollbar-thumb) transparent;
  }

  body {
    min-height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
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
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
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

  button:disabled,
  input:disabled,
  textarea:disabled,
  select:disabled,
  [aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.52;
  }

  input,
  textarea,
  select {
    color: var(--color-text-primary);
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--color-text-tertiary);
  }

  :where(a, button, input, textarea, select, [tabindex]):focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }

  :where(img, picture, video, canvas, svg) {
    display: block;
    max-width: 100%;
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
    background: var(--selection-bg);
    color: var(--selection-text);
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
