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
    // 메인 다크 컬러는 요청한 #141414 기준으로 고정했습니다.
    background: '#141414',
    surface: '#181818',
    surfaceMuted: '#1d1d1d',
    surfaceHover: '#222222',
    border: '#2a2a2a',
    borderStrong: '#3a3a3a',
    textPrimary: '#f5f5f5',
    textSecondary: '#bdbdbd',
    textTertiary: '#8a8a8a',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.16)',
    // 파스텔톤 대신 직관적인 상태 컬러로 교체했습니다.
    success: '#16a34a',
    successSoft: 'rgba(22, 163, 74, 0.16)',
    warning: '#f59e0b',
    warningSoft: 'rgba(245, 158, 11, 0.16)',
    error: '#ef4444',
    errorSoft: 'rgba(239, 68, 68, 0.16)',
    shadow: '0 1px 0 rgba(255, 255, 255, 0.03), 0 18px 46px rgba(0, 0, 0, 0.32)',
    focus: 'rgba(37, 99, 235, 0.32)',
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
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  min-height: 100vh;
  min-height: 100dvh;
  height: 100vh;
  height: 100dvh;
  padding: clamp(18px, 1.45vw, 28px);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--color-background);
  color: var(--color-text-primary);

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  @media (max-height: 900px) and (min-width: 1181px) {
    padding: 18px;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    min-height: 100dvh;
    padding: 16px;
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
  grid-template-columns: minmax(300px, 340px) minmax(0, 1fr) minmax(340px, 400px);
  gap: clamp(14px, 1.05vw, 20px);
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: calc(100dvh - var(--dashboard-grid-offset, 164px));
  max-height: calc(100dvh - var(--dashboard-grid-offset, 164px));
  overflow: hidden;

  > * {
    min-width: 0;
    min-height: 0;
  }

  @media (max-width: 1680px) {
    grid-template-columns: minmax(280px, 320px) minmax(0, 1fr) minmax(320px, 360px);
    gap: 16px;
  }

  @media (max-width: 1440px) {
    grid-template-columns: minmax(260px, 300px) minmax(0, 1fr) minmax(300px, 340px);
    gap: 14px;
  }

  @media (max-height: 900px) and (min-width: 1181px) {
    height: calc(100dvh - var(--dashboard-grid-offset-compact, 128px));
    max-height: calc(100dvh - var(--dashboard-grid-offset-compact, 128px));
    gap: 12px;
  }

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
    height: auto;
    max-height: none;
    overflow: visible;
  }
`;

export const LeftColumn = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 0.92fr) minmax(0, 1.08fr);
  gap: clamp(12px, 1.05vw, 20px);
  min-width: 0;
  min-height: 0;
  height: 100%;
  max-height: 100%;
  overflow: hidden;

  > * {
    min-width: 0;
    min-height: 0;
  }

  @media (max-height: 900px) and (min-width: 1181px) {
    gap: 12px;
  }

  @media (max-width: 1180px) {
    grid-template-rows: auto;
    height: auto;
    max-height: none;
    overflow: visible;
  }
`;

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  max-height: 100%;
  padding: clamp(16px, 1.25vw, 22px);
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: clamp(18px, 1.6vw, 26px);
  background: var(--color-surface);
  box-shadow: var(--color-shadow);
  color: var(--color-text-primary);

  > * {
    min-width: 0;
  }

  @media (max-height: 900px) and (min-width: 1181px) {
    padding: 16px;
    border-radius: 20px;
  }

  @media (max-width: 1180px) {
    height: auto;
    max-height: none;
    overflow: visible;
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 20px;
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
  flex: 0 0 auto;
  min-width: 0;
  margin-bottom: clamp(12px, 1vw, 18px);
  overflow: hidden;

  @media (max-height: 900px) and (min-width: 1181px) {
    margin-bottom: 10px;
  }

  @media (max-width: 720px) {
    flex-direction: column;
  }
`;

// 기존 코드 중 PanelHeader를 import하는 파일과의 호환을 위해 alias로 둡니다.
export const PanelHeader = PanelTop;

export const PanelTitleGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  color: var(--color-text-primary);
  font-size: clamp(19px, 1.22vw, 24px);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.03em;
  overflow-wrap: break-word;

  @media (max-height: 900px) and (min-width: 1181px) {
    font-size: 20px;
  }
`;

export const PanelCaption = styled.p`
  margin: 0;
  color: var(--color-text-secondary);
  font-size: clamp(13px, 0.86vw, 16px);
  line-height: 1.45;
  word-break: keep-all;
  overflow-wrap: break-word;

  @media (max-height: 900px) and (min-width: 1181px) {
    display: -webkit-box;
    overflow: hidden;
    font-size: 13px;
    line-height: 1.35;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`;
