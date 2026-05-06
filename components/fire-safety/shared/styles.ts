'use client';

import { createElement, forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';

import { useThemeStore } from '@/store/useThemeStore';

type AppThemeMode = 'light' | 'dark';

type AppThemeStyle = {
  colorScheme: AppThemeMode;

  background: string;
  surface1: string;
  surface2: string;
  surface3: string;
  surface4: string;

  borderSoft: string;
  borderStrong: string;

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

  shadowLg: string;
  focus: string;

  scrollbarThumb: string;
  scrollbarThumbHover: string;
};

const APP_THEME_STYLES: Record<AppThemeMode, AppThemeStyle> = {
  light: {
    colorScheme: 'light',

    background: '#f5f7fb',
    surface1: '#ffffff',
    surface2: '#f8fafc',
    surface3: '#f1f5f9',
    surface4: '#e5e7eb',

    borderSoft: '#e5e7eb',
    borderStrong: '#cbd5e1',

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

    shadowLg: '0 1px 2px rgba(15, 23, 42, 0.04)',
    focus: 'rgba(37, 99, 235, 0.18)',

    scrollbarThumb: 'rgba(148, 163, 184, 0.38)',
    scrollbarThumbHover: 'rgba(100, 116, 139, 0.5)',
  },

  dark: {
    colorScheme: 'dark',

    background: '#0f172a',
    surface1: '#111827',
    surface2: '#1f2937',
    surface3: '#273449',
    surface4: '#334155',

    borderSoft: 'rgba(148, 163, 184, 0.2)',
    borderStrong: 'rgba(148, 163, 184, 0.36)',

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

    shadowLg: '0 1px 2px rgba(0, 0, 0, 0.16)',
    focus: 'rgba(147, 197, 253, 0.24)',

    scrollbarThumb: 'rgba(148, 163, 184, 0.34)',
    scrollbarThumbHover: 'rgba(203, 213, 225, 0.42)',
  },
};

const getAppTheme = (isDark: boolean) =>
  isDark ? APP_THEME_STYLES.dark : APP_THEME_STYLES.light;

const createAppThemeVars = (theme: AppThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --bg: ${theme.background};

  --surface-1: ${theme.surface1};
  --surface-2: ${theme.surface2};
  --surface-3: ${theme.surface3};
  --surface-4: ${theme.surface4};

  --border-soft: ${theme.borderSoft};
  --border-strong: ${theme.borderStrong};

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

  --shadow-lg: ${theme.shadowLg};
  --focus: ${theme.focus};

  --scrollbar-thumb: ${theme.scrollbarThumb};
  --scrollbar-thumb-hover: ${theme.scrollbarThumbHover};

  --color-background: ${theme.background};

  --color-surface: ${theme.surface1};
  --color-surface-muted: ${theme.surface2};
  --color-surface-hover: ${theme.surface3};

  --color-border: ${theme.borderSoft};
  --color-border-strong: ${theme.borderStrong};

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

  --color-shadow: ${theme.shadowLg};
  --color-focus: ${theme.focus};
`;

const GlobalStyleBase = createGlobalStyle<{ $isDark: boolean }>`
  :root {
    ${({ $isDark }) => createAppThemeVars(getAppTheme($isDark))}
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
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
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
`;

export function GlobalStyle() {
  const isDark = useThemeStore((state) => state.isDark);

  return createElement(GlobalStyleBase, {
    $isDark: isDark,
  });
}

export const buttonReset = css`
  appearance: none;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;

const PageShellBase = styled.main<{ $isDark: boolean }>`
  ${({ $isDark }) => createAppThemeVars(getAppTheme($isDark))}

  min-height: 100vh;
  min-height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  padding: 24px;
  overflow: hidden;
  background: var(--color-background);
  color: var(--color-text-primary);
`;

type PageShellProps = ComponentPropsWithoutRef<'main'>;

export const PageShell = forwardRef<HTMLElement, PageShellProps>(
  ({ children, ...props }, ref) => {
    const isDark = useThemeStore((state) => state.isDark);

    return createElement(
      PageShellBase,
      {
        ...props,
        ref,
        $isDark: isDark,
      },
      children,
    );
  },
);

PageShell.displayName = 'PageShell';

export const AppFrame = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 18px;
  height: calc(100vh - 48px);
  height: calc(100dvh - 48px);
  min-height: 0;
`;

export const DashboardGrid = styled.section`
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr) 360px;
  gap: 18px;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1400px) {
    grid-template-columns: 280px minmax(0, 1fr) 340px;
  }

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
    overflow: visible;
  }
`;

export const Column = styled.div`
  display: grid;
  gap: 18px;
  min-height: 0;
`;

export const LeftColumn = styled(Column)`
  grid-template-rows: auto auto minmax(0, 1fr);

  @media (max-width: 1180px) {
    grid-template-rows: auto;
  }
`;

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 20px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 26px;
  background: var(--color-surface);
  box-shadow: var(--color-shadow);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 22px;
  }
`;

export const CenterPanel = styled(Panel)`
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  gap: 14px;
`;

export const RightPanel = styled(Panel)`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 14px;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;

export const PanelTitleGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  color: var(--color-text-primary);
  font-size: 26px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.03em;
`;

export const PanelCaption = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.7;
`;