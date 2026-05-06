import styled, { css } from 'styled-components';

import { buttonReset } from '../shared/styles';

type HeaderPillTone = 'live' | 'ok' | 'warning' | 'error' | 'neutral';

type ToneStyle = {
  color: string;
  border: string;
  background: string;
  backgroundHover: string;
};

type HeaderThemeStyle = {
  accent: string;
  textPrimary: string;
  textSecondary: string;
  surface: string;
  surfaceHover: string;
  border: string;
  borderStrong: string;
  focus: string;
  tones: Record<HeaderPillTone, ToneStyle>;
};

const HEADER_THEME_STYLES: Record<'light' | 'dark', HeaderThemeStyle> = {
  light: {
    accent: '#2563eb',
    textPrimary: '#111827',
    textSecondary: '#64748b',
    surface: '#ffffff',
    surfaceHover: '#f8fafc',
    border: '#e5e7eb',
    borderStrong: '#cbd5e1',
    focus: 'rgba(37, 99, 235, 0.18)',
    tones: {
      live: {
        color: '#2563eb',
        border: 'rgba(37, 99, 235, 0.24)',
        background: 'rgba(37, 99, 235, 0.08)',
        backgroundHover: 'rgba(37, 99, 235, 0.12)',
      },
      ok: {
        color: '#059669',
        border: 'rgba(5, 150, 105, 0.22)',
        background: 'rgba(5, 150, 105, 0.08)',
        backgroundHover: 'rgba(5, 150, 105, 0.12)',
      },
      warning: {
        color: '#d97706',
        border: 'rgba(217, 119, 6, 0.22)',
        background: 'rgba(217, 119, 6, 0.08)',
        backgroundHover: 'rgba(217, 119, 6, 0.12)',
      },
      error: {
        color: '#dc2626',
        border: 'rgba(220, 38, 38, 0.22)',
        background: 'rgba(220, 38, 38, 0.08)',
        backgroundHover: 'rgba(220, 38, 38, 0.12)',
      },
      neutral: {
        color: '#64748b',
        border: 'rgba(100, 116, 139, 0.2)',
        background: 'rgba(100, 116, 139, 0.08)',
        backgroundHover: 'rgba(100, 116, 139, 0.12)',
      },
    },
  },
  dark: {
    accent: '#93c5fd',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    surface: '#111827',
    surfaceHover: '#1f2937',
    border: 'rgba(148, 163, 184, 0.22)',
    borderStrong: 'rgba(148, 163, 184, 0.36)',
    focus: 'rgba(147, 197, 253, 0.24)',
    tones: {
      live: {
        color: '#93c5fd',
        border: 'rgba(147, 197, 253, 0.32)',
        background: 'rgba(147, 197, 253, 0.12)',
        backgroundHover: 'rgba(147, 197, 253, 0.16)',
      },
      ok: {
        color: '#86efac',
        border: 'rgba(134, 239, 172, 0.28)',
        background: 'rgba(134, 239, 172, 0.1)',
        backgroundHover: 'rgba(134, 239, 172, 0.14)',
      },
      warning: {
        color: '#fcd34d',
        border: 'rgba(252, 211, 77, 0.28)',
        background: 'rgba(252, 211, 77, 0.1)',
        backgroundHover: 'rgba(252, 211, 77, 0.14)',
      },
      error: {
        color: '#fca5a5',
        border: 'rgba(252, 165, 165, 0.28)',
        background: 'rgba(252, 165, 165, 0.1)',
        backgroundHover: 'rgba(252, 165, 165, 0.14)',
      },
      neutral: {
        color: '#cbd5e1',
        border: 'rgba(203, 213, 225, 0.22)',
        background: 'rgba(203, 213, 225, 0.08)',
        backgroundHover: 'rgba(203, 213, 225, 0.12)',
      },
    },
  },
};

const getHeaderTheme = (isDark: boolean) =>
  isDark ? HEADER_THEME_STYLES.dark : HEADER_THEME_STYLES.light;

const createHeaderThemeVars = (theme: HeaderThemeStyle) => css`
  --header-accent: ${theme.accent};
  --header-text-primary: ${theme.textPrimary};
  --header-text-secondary: ${theme.textSecondary};
  --header-surface: ${theme.surface};
  --header-surface-hover: ${theme.surfaceHover};
  --header-border: ${theme.border};
  --header-border-strong: ${theme.borderStrong};
  --header-focus: ${theme.focus};

  --pill-live-color: ${theme.tones.live.color};
  --pill-live-border: ${theme.tones.live.border};
  --pill-live-bg: ${theme.tones.live.background};
  --pill-live-bg-hover: ${theme.tones.live.backgroundHover};

  --pill-ok-color: ${theme.tones.ok.color};
  --pill-ok-border: ${theme.tones.ok.border};
  --pill-ok-bg: ${theme.tones.ok.background};
  --pill-ok-bg-hover: ${theme.tones.ok.backgroundHover};

  --pill-warning-color: ${theme.tones.warning.color};
  --pill-warning-border: ${theme.tones.warning.border};
  --pill-warning-bg: ${theme.tones.warning.background};
  --pill-warning-bg-hover: ${theme.tones.warning.backgroundHover};

  --pill-error-color: ${theme.tones.error.color};
  --pill-error-border: ${theme.tones.error.border};
  --pill-error-bg: ${theme.tones.error.background};
  --pill-error-bg-hover: ${theme.tones.error.backgroundHover};

  --pill-neutral-color: ${theme.tones.neutral.color};
  --pill-neutral-border: ${theme.tones.neutral.border};
  --pill-neutral-bg: ${theme.tones.neutral.background};
  --pill-neutral-bg-hover: ${theme.tones.neutral.backgroundHover};
`;

const PILL_TONE_VARS: Record<
  HeaderPillTone,
  {
    color: string;
    border: string;
    background: string;
  }
> = {
  live: {
    color: 'var(--pill-live-color)',
    border: 'var(--pill-live-border)',
    background: 'var(--pill-live-bg)',
  },
  ok: {
    color: 'var(--pill-ok-color)',
    border: 'var(--pill-ok-border)',
    background: 'var(--pill-ok-bg)',
  },
  warning: {
    color: 'var(--pill-warning-color)',
    border: 'var(--pill-warning-border)',
    background: 'var(--pill-warning-bg)',
  },
  error: {
    color: 'var(--pill-error-color)',
    border: 'var(--pill-error-border)',
    background: 'var(--pill-error-bg)',
  },
  neutral: {
    color: 'var(--pill-neutral-color)',
    border: 'var(--pill-neutral-border)',
    background: 'var(--pill-neutral-bg)',
  },
};

export const HeaderBar = styled.header<{ $isDark?: boolean }>`
  ${({ $isDark = false }) => createHeaderThemeVars(getHeaderTheme($isDark))}

  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const TitleBlock = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

export const Eyebrow = styled.div`
  color: var(--header-accent);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const MainTitle = styled.h1`
  margin: 0;
  color: var(--header-text-primary);
  font-size: clamp(28px, 3vw, 36px);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.04em;
`;

export const SubText = styled.p`
  max-width: 720px;
  margin: 0;
  color: var(--header-text-secondary);
  font-size: 15px;
  line-height: 1.7;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const HeaderPill = styled.div<{
  $tone: HeaderPillTone;
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid ${({ $tone }) => PILL_TONE_VARS[$tone].border};
  border-radius: 999px;
  background: ${({ $tone }) => PILL_TONE_VARS[$tone].background};
  color: ${({ $tone }) => PILL_TONE_VARS[$tone].color};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
`;

export const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--pill-live-color);
`;

export const AutoRunButton = styled.button<{ $active: boolean }>`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 42px;
  padding: 0 15px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'var(--pill-live-border)' : 'var(--header-border)'};
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? 'var(--pill-live-bg)' : 'var(--header-surface)'};
  color: ${({ $active }) =>
    $active ? 'var(--pill-live-color)' : 'var(--header-text-primary)'};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $active }) =>
      $active ? 'var(--pill-live-border)' : 'var(--header-border-strong)'};
    background: ${({ $active }) =>
      $active ? 'var(--pill-live-bg-hover)' : 'var(--header-surface-hover)'};
  }

  &:focus-visible {
    outline: 3px solid var(--header-focus);
    outline-offset: 2px;
  }
`;