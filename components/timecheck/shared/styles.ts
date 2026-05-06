'use client';

import { createElement, forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styled, { css, keyframes } from 'styled-components';

import { useThemeStore } from '@/store/useThemeStore';

type DashboardThemeMode = 'light' | 'dark';

type DashboardThemeStyle = {
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
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  error: string;
  errorSoft: string;
  shadow: string;
  focus: string;
};

const DASHBOARD_THEME_STYLES: Record<DashboardThemeMode, DashboardThemeStyle> = {
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
    success: '#059669',
    successSoft: 'rgba(5, 150, 105, 0.08)',
    warning: '#d97706',
    warningSoft: 'rgba(217, 119, 6, 0.08)',
    error: '#dc2626',
    errorSoft: 'rgba(220, 38, 38, 0.08)',
    shadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    focus: 'rgba(37, 99, 235, 0.18)',
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
    success: '#86efac',
    successSoft: 'rgba(134, 239, 172, 0.1)',
    warning: '#fcd34d',
    warningSoft: 'rgba(252, 211, 77, 0.1)',
    error: '#fca5a5',
    errorSoft: 'rgba(252, 165, 165, 0.1)',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.16)',
    focus: 'rgba(147, 197, 253, 0.24)',
  },
};

const getDashboardTheme = (isDark: boolean) =>
  isDark ? DASHBOARD_THEME_STYLES.dark : DASHBOARD_THEME_STYLES.light;

const createDashboardThemeVars = (theme: DashboardThemeStyle) => css`
  --color-background: ${theme.background};
  --color-surface: ${theme.surface};
  --color-surface-muted: ${theme.surfaceMuted};
  --color-surface-hover: ${theme.surfaceHover};

  --color-border: ${theme.border};
  --color-border-strong: ${theme.borderStrong};

  --color-text-primary: ${theme.textPrimary};
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

export const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }

  70% {
    transform: scale(1.08);
    opacity: 0.72;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

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
  ${({ $isDark }) => createDashboardThemeVars(getDashboardTheme($isDark))}

  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  height: 100dvh;
  padding: 28px;
  overflow: hidden;
  background: var(--color-background);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    padding: 20px;
    overflow: visible;
  }
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

export const DashboardGrid = styled.section`
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr) 440px;
  gap: 20px;
  min-height: calc(100vh - 164px);

  @media (max-width: 1380px) {
    grid-template-columns: 320px minmax(0, 1fr) 360px;
  }

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

export const LeftColumn = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: 20px;
  min-height: 0;
  max-height: calc(100vh - 130px);

  @media (max-width: 1180px) {
    grid-template-rows: auto;
    max-height: none;
  }
`;

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  max-height: calc(100vh - 130px);
  padding: 22px;
  border: 1px solid var(--color-border);
  border-radius: 26px;
  background: var(--color-surface);
  box-shadow: var(--color-shadow);
  color: var(--color-text-primary);

  @media (max-width: 1180px) {
    max-height: none;
  }

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 22px;
  }
`;

export const CenterPanel = styled(Panel)`
  overflow: hidden;
`;

export const RightPanel = styled(Panel)`
  overflow: hidden;
`;

export const PanelTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  overflow: hidden;
`;

export const PanelTitleGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.03em;
`;

export const PanelCaption = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 18px;
  line-height: 1.4;
`;