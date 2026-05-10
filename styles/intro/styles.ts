import Link from 'next/link';
import styled, { css } from 'styled-components';

import type { LandingThemeStyle } from '@/model/intro//types';

const LANDING_THEME_STYLES: Record<'light' | 'dark', LandingThemeStyle> = {
  light: {
    colorScheme: 'light',
    background: '#f5f7fb',
    surface: '#ffffff',
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
    shadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    shadowStrong: '0 18px 48px rgba(15, 23, 42, 0.10)',
    focus: 'rgba(37, 99, 235, 0.18)',
  },
  dark: {
    colorScheme: 'dark',
    background: '#141414',
    surface: '#181818',
    surfaceMuted: '#1d1d1d',
    surfaceHover: '#222222',
    border: '#2a2a2a',
    borderStrong: '#3a3a3a',
    textPrimary: '#f5f5f5',
    textSecondary: '#a3a3a3',
    textTertiary: '#737373',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.16)',
    onAccent: '#ffffff',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.28)',
    shadowStrong: '0 18px 48px rgba(0, 0, 0, 0.42)',
    focus: 'rgba(37, 99, 235, 0.28)',
  },
};

const createLandingThemeVars = (theme: LandingThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --landing-bg: ${theme.background};
  --landing-surface: ${theme.surface};
  --landing-surface-muted: ${theme.surfaceMuted};
  --landing-surface-hover: ${theme.surfaceHover};

  --landing-border: ${theme.border};
  --landing-border-strong: ${theme.borderStrong};

  --landing-text-primary: ${theme.textPrimary};
  --landing-text-secondary: ${theme.textSecondary};
  --landing-text-tertiary: ${theme.textTertiary};

  --landing-accent: ${theme.accent};
  --landing-accent-soft: ${theme.accentSoft};
  --landing-on-accent: ${theme.onAccent};

  --landing-shadow: ${theme.shadow};
  --landing-shadow-strong: ${theme.shadowStrong};
  --landing-focus: ${theme.focus};
`;

export const buttonReset = css`
  appearance: none;
  border: 0;
  outline: none;
  padding: 0;
  margin: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
`;

export const LandingThemeScope = styled.div<{ $isDark: boolean }>`
  ${({ $isDark }) =>
    createLandingThemeVars(
      $isDark ? LANDING_THEME_STYLES.dark : LANDING_THEME_STYLES.light,
    )}

  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--landing-bg);
  color: var(--landing-text-primary);
  font-family:
    'Pretendard Variable',
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'SF Pro Display',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
`;

export const PageShell = styled.main`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  padding: clamp(22px, 3.2vw, 48px);
  background: var(--landing-bg);

  @media (max-width: 720px) {
    padding: 18px;
  }
`;

export const ContentFrame = styled.div`
  display: grid;
  gap: clamp(20px, 2.2vw, 34px);
  width: min(100%, 1760px);
  min-height: calc(100vh - clamp(44px, 6.4vw, 96px));
  min-height: calc(100dvh - clamp(44px, 6.4vw, 96px));
  margin: 0 auto;
`;

export const HeroLayout = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(360px, 0.92fr);
  gap: clamp(18px, 2vw, 30px);
  align-items: stretch;
  min-width: 0;

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroCopy = styled.div`
  display: grid;
  align-content: end;
  gap: clamp(18px, 1.8vw, 28px);
  min-width: 0;
  min-height: 420px;
  padding: clamp(26px, 4.2vw, 64px);
  border: 1px solid var(--landing-border);
  border-radius: 16px;
  background: var(--landing-surface);
  box-shadow: var(--landing-shadow);

  @media (max-width: 1120px) {
    min-height: auto;
  }

  @media (max-width: 720px) {
    padding: 24px;
  }
`;

export const HeroKicker = styled.div`
  display: inline-grid;
  grid-template-columns: 36px auto;
  gap: 12px;
  align-items: center;
  width: fit-content;
  color: var(--landing-accent);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;

  &::before {
    display: block;
    width: 36px;
    height: 2px;
    background: var(--landing-accent);
    content: '';
  }
`;

export const HeroTitle = styled.h1`
  max-width: 980px;
  margin: 0;
  color: var(--landing-text-primary);
  font-size: clamp(44px, 6vw, 98px);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.075em;
  word-break: keep-all;

  span {
    color: var(--landing-accent);
  }
`;

export const HeroDescription = styled.p`
  max-width: 720px;
  margin: 0;
  color: var(--landing-text-secondary);
  font-size: clamp(17px, 1.2vw, 22px);
  font-weight: 500;
  line-height: 1.62;
  word-break: keep-all;
`;

export const HeroActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const heroActionBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 46px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease,
    transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid var(--landing-focus);
    outline-offset: 2px;
  }
`;

export const PrimaryHeroLink = styled(Link)`
  ${heroActionBase};

  border: 1px solid var(--landing-accent);
  background: var(--landing-accent);
  color: var(--landing-on-accent);
`;

export const SecondaryHeroButton = styled.button`
  ${buttonReset};
  ${heroActionBase};

  border: 1px solid var(--landing-border);
  background: var(--landing-surface-muted);
  color: var(--landing-text-primary);

  &:hover {
    border-color: var(--landing-border-strong);
    background: var(--landing-surface-hover);
  }
`;

export const HeroPreview = styled.aside`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 18px;
  min-width: 0;
  min-height: 420px;
  padding: clamp(24px, 3vw, 38px);
  border: 1px solid var(--landing-border);
  border-radius: 16px;
  background: var(--landing-surface);
  box-shadow: var(--landing-shadow);

  @media (max-width: 1120px) {
    min-height: 320px;
  }

  @media (max-width: 720px) {
    padding: 22px;
  }
`;

export const PreviewTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
`;

export const PreviewLabelGroup = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
`;

export const PreviewEyebrow = styled.div`
  color: var(--landing-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
`;

export const PreviewTitle = styled.h2`
  margin: 0;
  color: var(--landing-text-primary);
  font-size: clamp(28px, 2.5vw, 44px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.055em;
`;

export const PreviewIndex = styled.div`
  flex: 0 0 auto;
  color: var(--landing-text-tertiary);
  font-family:
    'SFMono-Regular',
    ui-monospace,
    Menlo,
    Monaco,
    Consolas,
    monospace;
  font-size: 13px;
  font-weight: 700;
`;

export const PreviewIconFrame = styled.div`
  display: grid;
  place-items: center;
  width: 82px;
  height: 82px;
  border: 1px solid var(--landing-border);
  border-radius: 14px;
  background: var(--landing-surface-muted);
  color: var(--landing-accent);
`;

export const PreviewDescription = styled.p`
  align-self: end;
  max-width: 560px;
  margin: 0;
  color: var(--landing-text-secondary);
  font-size: clamp(17px, 1.25vw, 22px);
  font-weight: 500;
  line-height: 1.6;
  word-break: keep-all;
`;

export const PreviewFooter = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  padding-top: 18px;
  border-top: 1px solid var(--landing-border);

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const PreviewMeta = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;

  span {
    color: var(--landing-text-tertiary);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  strong {
    min-width: 0;
    overflow: hidden;
    color: var(--landing-text-primary);
    font-size: 16px;
    font-weight: 700;
    line-height: 1.3;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const PreviewLink = styled(Link)`
  ${heroActionBase};

  min-height: 40px;
  padding: 0 13px;
  border: 1px solid var(--landing-border);
  background: var(--landing-surface-muted);
  color: var(--landing-text-primary);

  &:hover {
    border-color: var(--landing-accent);
    color: var(--landing-accent);
    background: var(--landing-surface-hover);
  }
`;

export const StatusStrip = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  min-width: 0;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const StatusItem = styled.article`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  min-width: 0;
  padding: 18px;
  border: 1px solid var(--landing-border);
  border-radius: 14px;
  background: var(--landing-surface);
  box-shadow: var(--landing-shadow);
`;

export const StatusValue = styled.strong`
  display: inline-grid;
  place-items: center;
  min-width: 64px;
  min-height: 48px;
  padding: 0 12px;
  border: 1px solid var(--landing-border);
  border-radius: 10px;
  background: var(--landing-surface-muted);
  color: var(--landing-accent);
  font-size: clamp(20px, 1.8vw, 28px);
  font-weight: 700;
  letter-spacing: -0.04em;
`;

export const StatusText = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;

  span {
    color: var(--landing-text-primary);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.25;
  }

  p {
    margin: 0;
    color: var(--landing-text-secondary);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.45;
    word-break: keep-all;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  min-width: 0;

  @media (max-width: 820px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const SectionTitleGroup = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

export const SectionKicker = styled.div`
  color: var(--landing-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: var(--landing-text-primary);
  font-size: clamp(28px, 2.4vw, 42px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.055em;
`;

export const SectionDescription = styled.p`
  max-width: 740px;
  margin: 0;
  color: var(--landing-text-secondary);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  word-break: keep-all;
`;

export const MenuGridShell = styled.section`
  display: grid;
  gap: 16px;
  min-width: 0;
`;

export const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  min-width: 0;

  @media (max-width: 1320px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const MenuCardLink = styled(Link)<{ $isActive: boolean }>`
  position: relative;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 22px;
  min-height: clamp(260px, 24vh, 360px);
  min-width: 0;
  padding: clamp(20px, 2.2vw, 30px);
  overflow: hidden;
  border: 2px solid
    ${({ $isActive }) =>
      $isActive ? 'var(--landing-accent)' : 'var(--landing-border)'};
  border-radius: 14px;
  background: ${({ $isActive }) =>
    $isActive ? 'var(--landing-surface-hover)' : 'var(--landing-surface)'};
  box-shadow: var(--landing-shadow);
  color: var(--landing-text-primary);
  text-decoration: none;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
  -webkit-tap-highlight-color: transparent;

  &:hover,
  &:focus-visible {
    border-color: var(--landing-accent);
    background: var(--landing-surface-hover);
    box-shadow: var(--landing-shadow-strong);
    transform: translateY(-2px);
    border: 2px solid var(--landing-accent);

    &::before {
      opacity: 1;
    }
  }

  &:focus-visible {
    outline: 3px solid var(--landing-focus);
    outline-offset: 2px;
  }

  @media (max-width: 760px) {
    min-height: 240px;
  }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;
`;

export const CardIcon = styled.div<{ $isActive: boolean }>`
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  flex: 0 0 auto;
  border: 1px solid
    ${({ $isActive }) =>
      $isActive ? 'var(--landing-accent)' : 'var(--landing-border)'};
  border-radius: 12px;
  background: ${({ $isActive }) =>
    $isActive ? 'var(--landing-accent)' : 'var(--landing-surface-muted)'};
  color: ${({ $isActive }) =>
    $isActive ? 'var(--landing-on-accent)' : 'var(--landing-accent)'};
  transition:
    border-color 180ms ease,
    background 180ms ease,
    color 180ms ease;
`;

export const CardCode = styled.div`
  color: var(--landing-text-tertiary);
  font-family:
    'SFMono-Regular',
    ui-monospace,
    Menlo,
    Monaco,
    Consolas,
    monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

export const CardText = styled.div`
  display: grid;
  align-content: end;
  gap: 10px;
  min-width: 0;
`;

export const CardEyebrow = styled.div`
  color: var(--landing-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  line-height: 1;
  text-transform: uppercase;
`;

export const CardTitle = styled.h3`
  margin: 0;
  color: var(--landing-text-primary);
  font-size: clamp(30px, 3vw, 46px);
  font-weight: 700;
  line-height: 1.04;
  letter-spacing: -0.06em;
  word-break: keep-all;
`;

export const CardDescription = styled.p`
  max-width: 560px;
  margin: 0;
  color: var(--landing-text-secondary);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.58;
  word-break: keep-all;
`;

export const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
  padding-top: 18px;
  border-top: 1px solid var(--landing-border);
`;

export const CardMetric = styled.div`
  display: grid;
  gap: 3px;
  min-width: 0;

  span {
    color: var(--landing-text-tertiary);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  strong {
    color: var(--landing-text-primary);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.2;
  }
`;

export const CardArrow = styled.div<{ $isActive: boolean }>`
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border: 1px solid
    ${({ $isActive }) =>
      $isActive ? 'var(--landing-accent)' : 'var(--landing-border)'};
  border-radius: 10px;
  background: ${({ $isActive }) =>
    $isActive ? 'var(--landing-accent)' : 'var(--landing-surface-muted)'};
  color: ${({ $isActive }) =>
    $isActive ? 'var(--landing-on-accent)' : 'var(--landing-text-secondary)'};
  transform: ${({ $isActive }) => ($isActive ? 'translate(2px, -2px)' : 'none')};
  transition:
    border-color 180ms ease,
    background 180ms ease,
    color 180ms ease,
    transform 180ms ease;

  ${MenuCardLink}:hover &,
  ${MenuCardLink}:focus-visible & {
    border-color: var(--landing-accent);
    background: var(--landing-accent);
    color: var(--landing-on-accent);
    transform: translate(2px, -2px);
  }
`;

export const FooterNote = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 4px;
  color: var(--landing-text-tertiary);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;

  strong {
    color: var(--landing-text-secondary);
    font-weight: 700;
  }
`;
