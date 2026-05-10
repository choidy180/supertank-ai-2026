import styled, { css } from 'styled-components';

import type { ApprovalStep, CellTone, ReportThemeStyle } from '@/model/drum-tub-report-clean-refactor/types';

const REPORT_THEME: Record<'light' | 'dark', ReportThemeStyle> = {
  light: {
    colorScheme: 'light',
    pageBg: '#f6f7f9',
    surface: '#ffffff',
    surfaceSoft: '#f8fafc',
    surfaceHover: '#f1f5f9',
    border: '#e5e7eb',
    borderStrong: '#cbd5e1',
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textTertiary: '#9ca3af',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.08)',
    accentStrong: '#1d4ed8',
    onAccent: '#ffffff',
    success: '#16a34a',
    successSoft: 'rgba(22, 163, 74, 0.08)',
    warning: '#d97706',
    warningSoft: 'rgba(217, 119, 6, 0.1)',
    danger: '#dc2626',
    dangerSoft: 'rgba(220, 38, 38, 0.08)',
    neutralSoft: 'rgba(17, 24, 39, 0.05)',
    shadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
    shadowRaised: '0 12px 24px rgba(15, 23, 42, 0.08)',
    focus: 'rgba(37, 99, 235, 0.2)',
    gridLine: '#e5e7eb',
    tableHead: '#f8fafc',
  },
  dark: {
    colorScheme: 'dark',
    pageBg: '#141414',
    surface: '#181818',
    surfaceSoft: '#1d1d1d',
    surfaceHover: '#222222',
    border: '#2a2a2a',
    borderStrong: '#3a3a3a',
    textPrimary: '#f7f7f7',
    textSecondary: '#b8b8b8',
    textTertiary: '#7d7d7d',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.16)',
    accentStrong: '#3b82f6',
    onAccent: '#ffffff',
    success: '#16a34a',
    successSoft: 'rgba(22, 163, 74, 0.16)',
    warning: '#f59e0b',
    warningSoft: 'rgba(245, 158, 11, 0.14)',
    danger: '#ef4444',
    dangerSoft: 'rgba(239, 68, 68, 0.14)',
    neutralSoft: 'rgba(255, 255, 255, 0.06)',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.22)',
    shadowRaised: '0 14px 28px rgba(0, 0, 0, 0.28)',
    focus: 'rgba(37, 99, 235, 0.34)',
    gridLine: '#2d2d2d',
    tableHead: '#1d1d1d',
  },
};

const createReportThemeVars = (theme: ReportThemeStyle) => css`
  color-scheme: ${theme.colorScheme};

  --report-bg: ${theme.pageBg};
  --report-surface: ${theme.surface};
  --report-surface-soft: ${theme.surfaceSoft};
  --report-surface-hover: ${theme.surfaceHover};

  --report-border: ${theme.border};
  --report-border-strong: ${theme.borderStrong};
  --report-grid-line: ${theme.gridLine};
  --report-table-head: ${theme.tableHead};

  --report-text-primary: ${theme.textPrimary};
  --report-text-secondary: ${theme.textSecondary};
  --report-text-tertiary: ${theme.textTertiary};

  --report-accent: ${theme.accent};
  --report-accent-soft: ${theme.accentSoft};
  --report-accent-strong: ${theme.accentStrong};
  --report-on-accent: ${theme.onAccent};

  --report-success: ${theme.success};
  --report-success-soft: ${theme.successSoft};
  --report-warning: ${theme.warning};
  --report-warning-soft: ${theme.warningSoft};
  --report-danger: ${theme.danger};
  --report-danger-soft: ${theme.dangerSoft};
  --report-neutral-soft: ${theme.neutralSoft};

  --report-shadow: ${theme.shadow};
  --report-shadow-raised: ${theme.shadowRaised};
  --report-focus: ${theme.focus};
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

export const toneCss = (tone: CellTone) => {
  const toneMap: Record<CellTone, { color: string; bg: string; border: string }> = {
    ok: {
      color: 'var(--report-success)',
      bg: 'var(--report-success-soft)',
      border: 'var(--report-success)',
    },
    warn: {
      color: 'var(--report-warning)',
      bg: 'var(--report-warning-soft)',
      border: 'var(--report-warning)',
    },
    empty: {
      color: 'var(--report-text-tertiary)',
      bg: 'var(--report-neutral-soft)',
      border: 'var(--report-border-strong)',
    },
    info: {
      color: 'var(--report-accent)',
      bg: 'var(--report-accent-soft)',
      border: 'var(--report-accent)',
    },
    danger: {
      color: 'var(--report-danger)',
      bg: 'var(--report-danger-soft)',
      border: 'var(--report-danger)',
    },
  };

  return css`
    --tone-color: ${toneMap[tone].color};
    --tone-bg: ${toneMap[tone].bg};
    --tone-border: ${toneMap[tone].border};
  `;
};

export const ThemeScope = styled.div<{ $isDark: boolean }>`
  ${({ $isDark }) => createReportThemeVars($isDark ? REPORT_THEME.dark : REPORT_THEME.light)}

  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  background: var(--report-bg);
  color: var(--report-text-primary);
  font-family:
    'Pretendard Variable',
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    sans-serif;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  @media (max-width: 1180px) {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }
`;

export const PageShell = styled.main`
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 14px;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 22px;

  @media (max-width: 1180px) {
    height: auto;
    overflow: visible;
  }

  @media (max-width: 900px) {
    padding: 16px;
  }

  @media print {
    display: block;
    height: auto;
    padding: 0;
    overflow: visible;
    background: #ffffff;
  }
`;

export const TopBar = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;

  @media (max-width: 1160px) {
    flex-direction: column;
  }

  @media print {
    display: none;
  }
`;

export const HeroBlock = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  min-width: 0;
`;

export const HeroText = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

export const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 20px;
  color: var(--report-accent);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const PageTitle = styled.h1`
  margin: 0;
  color: var(--report-text-primary);
  font-size: clamp(28px, 2.2vw, 36px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.05em;
`;

export const PageDescription = styled.p`
  max-width: 760px;
  margin: 0;
  color: var(--report-text-secondary);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.45;
  word-break: keep-all;
`;

export const TopActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;
  flex-wrap: wrap;
`;

export const SearchBox = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid var(--report-border);
  border-radius: 8px;
  background: var(--report-surface);
  color: var(--report-text-tertiary);
  font-size: 13px;
  font-weight: 600;
  box-shadow: var(--report-shadow);
`;

export const ActionButtonBase = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 13px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:focus-visible {
    outline: 3px solid var(--report-focus);
    outline-offset: 2px;
  }
`;

export const GhostActionButton = styled(ActionButtonBase)`
  border: 1px solid var(--report-border);
  background: var(--report-surface);
  color: var(--report-text-primary);
  box-shadow: var(--report-shadow);

  &:hover {
    border-color: var(--report-border-strong);
    background: var(--report-surface-hover);
  }
`;

export const PrimaryActionButton = styled(ActionButtonBase)`
  border: 1px solid var(--report-accent);
  background: var(--report-accent);
  color: var(--report-on-accent);

  &:hover {
    border-color: var(--report-accent-strong);
    background: var(--report-accent-strong);
  }
`;

export const SummaryStrip = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  min-height: 0;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }

  @media print {
    display: none;
  }
`;

export const SummaryTile = styled.article<{ $tone: CellTone }>`
  ${({ $tone }) => toneCss($tone)}

  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 3px 12px;
  min-width: 0;
  min-height: 74px;
  padding: 13px 14px 13px 16px;
  overflow: hidden;
  /* border: 1px solid var(--report-border); */
  border: 2px solid var(--tone-border);
  border-radius: 10px;
  background: var(--report-surface);
  box-shadow: var(--report-shadow);

  span {
    align-self: end;
    color: var(--report-text-secondary);
    font-size: 13px;
    font-weight: 600;
  }

  strong {
    grid-row: span 2;
    align-self: center;
    color: var(--tone-color);
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.05em;
  }

  small {
    min-width: 0;
    overflow: hidden;
    color: var(--report-text-tertiary);
    font-size: 12px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const MainGrid = styled.section`
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) 280px;
  gap: 12px;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1440px) {
    grid-template-columns: 220px minmax(0, 1fr) 254px;
  }

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
    overflow: visible;
  }

  @media print {
    display: block;
    overflow: visible;
  }
`;

const railScrollbar = css`
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: var(--report-border-strong);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const LeftRail = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;
  ${railScrollbar}

  @media (max-width: 1180px) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    overflow: visible;
    padding-right: 0;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  @media print {
    display: none;
  }
`;

export const RightRail = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;
  ${railScrollbar}

  @media (max-width: 1180px) {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    overflow: visible;
    padding-right: 0;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  @media print {
    display: none;
  }
`;

export const SideCard = styled.section<{ $scroll?: boolean }>`
  display: grid;
  gap: 8px;
  min-width: 0;
  min-height: 0;
  padding: 12px;
  border: 1px solid var(--report-border);
  border-radius: 12px;
  background: var(--report-surface);
  box-shadow: var(--report-shadow);

  ${({ $scroll }) =>
    $scroll &&
    css`
      flex: 1 1 auto;
      overflow: hidden;
    `}
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;

  svg {
    flex: 0 0 auto;
    color: var(--report-text-tertiary);
  }
`;

export const CardTitle = styled.h2`
  margin: 0;
  color: var(--report-text-primary);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

export const Badge = styled.span<{ $tone: CellTone }>`
  ${({ $tone }) => toneCss($tone)}

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid var(--tone-border);
  border-radius: 6px;
  background: var(--tone-bg);
  color: var(--tone-color);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
`;

export const InfoList = styled.div`
  display: grid;
  gap: 8px;
`;

export const InfoItem = styled.div`
  display: grid;
  gap: 4px;
  padding: 10px;
  border: 1px solid var(--report-border);
  border-radius: 8px;
  background: var(--report-surface-soft);

  span {
    color: var(--report-text-tertiary);
    font-size: 12px;
    font-weight: 600;
  }

  strong {
    min-width: 0;
    overflow: hidden;
    color: var(--report-text-primary);
    font-size: 13px;
    font-weight: 700;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ProgressBlock = styled.div`
  display: grid;
  gap: 10px;
`;

export const ProgressTrack = styled.div`
  height: 8px;
  overflow: hidden;
  border: 1px solid var(--report-border);
  border-radius: 8px;
  background: var(--report-surface-soft);
`;

export const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  background: var(--report-accent);
  transition: width 180ms ease;
`;

export const ProgressCaption = styled.p`
  margin: 0;
  color: var(--report-text-secondary);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  word-break: keep-all;
`;

export const AnchorList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const AnchorButton = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 9px;
  border: 1px solid var(--report-border);
  border-radius: 7px;
  background: var(--report-surface-soft);
  color: var(--report-text-secondary);
  font-size: 12px;
  font-weight: 600;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    border-color: var(--report-accent);
    background: var(--report-accent-soft);
    color: var(--report-accent);
  }

  &:focus-visible {
    outline: 3px solid var(--report-focus);
    outline-offset: 2px;
  }
`;

export const ReportWorkspace = styled.section`
  min-width: 0;
  min-height: 0;
  overflow: auto;
  padding: 1px 1px 10px;
  overscroll-behavior: contain;
  ${railScrollbar}

  @media print {
    overflow: visible;
    padding: 0;
  }
`;

export const ReportPaper = styled.article`
  display: grid;
  gap: 12px;
  min-width: 1320px;
  min-height: 100%;
  padding: 18px;
  border: 1px solid var(--report-border);
  border-radius: 14px;
  background: var(--report-surface);
  box-shadow: var(--report-shadow-raised);

  @media print {
    min-width: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    background: #ffffff;
    color: #111827;
  }
`;

export const ReportHeader = styled.header`
  display: grid;
  grid-template-columns: minmax(300px, 1.05fr) minmax(270px, 0.85fr) 300px;
  gap: 10px;
  align-items: stretch;
`;

export const DocumentTitleBlock = styled.div`
  display: grid;
  align-content: center;
  gap: 6px;
  min-height: 104px;
  padding: 18px;
  border: 1px solid var(--report-border);
  /* border-left: 3px solid var(--report-accent); */
  border-radius: 10px;
  background: var(--report-surface);
`;

export const MiniLabel = styled.span`
  color: var(--report-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const DocumentTitle = styled.h2`
  margin: 0;
  color: var(--report-text-primary);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.05em;
  line-height: 1.18;
`;

export const DocumentSubtitle = styled.p`
  margin: 0;
  color: var(--report-text-secondary);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

export const MetaPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

export const MetaCell = styled.div`
  display: grid;
  align-content: center;
  justify-items: start;
  gap: 4px;
  min-height: 104px;
  padding: 14px;
  border: 1px solid var(--report-border);
  border-radius: 10px;
  background: var(--report-surface-soft);

  svg {
    width: 18px;
    height: 18px;
    color: var(--report-accent);
  }

  span {
    color: var(--report-text-tertiary);
    font-size: 12px;
    font-weight: 600;
  }

  strong {
    color: var(--report-text-primary);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.3;
  }
`;

export const ApprovalPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

export const ApprovalCell = styled.div<{ $status: ApprovalStep['status'] }>`
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 5px;
  min-height: 104px;
  padding: 12px;
  border: 1px solid
    ${({ $status }) =>
      $status === 'done' ? 'var(--report-success)' : 'var(--report-border)'};
  border-radius: 10px;
  background: ${({ $status }) =>
    $status === 'done'
      ? 'var(--report-success-soft)'
      : 'var(--report-surface-soft)'};

  span {
    color: ${({ $status }) =>
      $status === 'done' ? 'var(--report-success)' : 'var(--report-text-tertiary)'};
    font-size: 12px;
    font-weight: 700;
  }

  strong {
    color: var(--report-text-primary);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  small {
    color: var(--report-text-secondary);
    font-size: 13px;
    font-weight: 600;
  }
`;

export const LotNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid var(--report-border);
  border-radius: 8px;
  background: var(--report-surface-soft);
  color: var(--report-text-secondary);
  font-size: 13px;
  font-weight: 600;

  svg {
    color: var(--report-accent);
  }
`;

export const ReportTableShell = styled.div`
  overflow: hidden;
  border: 1px solid var(--report-grid-line);
  border-radius: 10px;
  background: var(--report-surface);

  @media print {
    border-radius: 0;
  }
`;

export const ReportTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;

  th,
  td {
    border-right: 1px solid var(--report-grid-line);
    border-bottom: 1px solid var(--report-grid-line);
    vertical-align: middle;
  }

  th:last-child,
  td:last-child {
    border-right: 0;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  thead th {
    position: sticky;
    top: 0;
    z-index: 3;
    height: 42px;
    padding: 0 10px;
    background: var(--report-table-head);
    color: var(--report-text-secondary);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: -0.02em;
    text-align: center;
  }

  tbody td {
    min-height: 58px;
    padding: 10px;
    color: var(--report-text-primary);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.42;
  }
`;

export const GroupCell = styled.td`
  background: var(--report-surface-soft);
  text-align: center;
`;

export const GroupName = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 38px;
  color: var(--report-text-primary);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
  word-break: keep-all;
`;

export const ItemCell = styled.td`
  background: var(--report-surface-soft);

  strong {
    display: block;
    color: var(--report-text-primary);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: -0.03em;
    word-break: keep-all;
  }
`;

export const SpecCell = styled.td`
  color: var(--report-text-secondary);

  span {
    display: block;
    min-height: 20px;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.5;
  }
`;

export const ReferenceCell = styled.td`
  padding: 7px !important;
`;

export const ReferenceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
`;

export const ReferencePreview = styled.div`
  position: relative;
  display: grid;
  place-items: end start;
  min-height: 48px;
  overflow: hidden;
  padding: 7px;
  border: 1px solid var(--report-border);
  border-radius: 8px;
  background: var(--report-surface-soft);

  span {
    position: relative;
    z-index: 2;
    color: var(--report-text-secondary);
    font-size: 11px;
    font-weight: 600;
  }
`;

export const ReferenceLine = styled.div`
  position: absolute;
  top: 20px;
  right: 9px;
  left: 9px;
  height: 5px;
  border-radius: 6px;
  background: var(--report-text-tertiary);
  opacity: 0.45;
`;

export const ReferenceDot = styled.div`
  position: absolute;
  top: 13px;
  left: 24px;
  width: 14px;
  height: 14px;
  border: 2px solid var(--report-surface-soft);
  border-radius: 50%;
  background: var(--report-accent);
`;

export const EmptyReference = styled.div`
  display: grid;
  place-items: center;
  min-height: 48px;
  border: 1px dashed var(--report-border-strong);
  border-radius: 8px;
  color: var(--report-text-tertiary);
  font-size: 12px;
  font-weight: 600;
`;

export const ValueCell = styled.td`
  text-align: center;
`;

export const ValuePill = styled.span<{ $tone: CellTone }>`
  ${({ $tone }) => toneCss($tone)}

  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 62px;
  max-width: 100%;
  min-height: 28px;
  padding: 0 8px;
  border: 1px solid var(--tone-border);
  border-radius: 6px;
  background: var(--tone-bg);
  color: var(--tone-color);
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  overflow-wrap: anywhere;
`;

export const MemoCell = styled.td`
  color: var(--report-text-secondary) !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  word-break: keep-all;
`;

export const ReportFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 36px;
  padding: 0 2px;
  color: var(--report-text-tertiary);
  font-size: 13px;
  font-weight: 600;
`;

export const FooterNote = styled.span`
  color: var(--report-text-tertiary);
`;

export const FooterStamp = styled.span`
  color: var(--report-accent);
  font-weight: 700;
  letter-spacing: 0.04em;
`;

export const ApprovalTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  overflow-y: auto;
  ${railScrollbar}
`;

export const TimelineItem = styled.div<{ $done: boolean }>`
  display: flex;
  gap: 10px;
  min-width: 0;
  padding: 10px;
  border: 1px solid ${({ $done }) => ($done ? 'var(--report-success)' : 'var(--report-border)')};
  border-radius: 10px;
  background: ${({ $done }) => ($done ? 'var(--report-success-soft)' : 'var(--report-surface-soft)')};

  div:last-child {
    display: grid;
    gap: 3px;
    min-width: 0;
  }

  strong {
    color: var(--report-text-primary);
    font-size: 13px;
    font-weight: 700;
  }

  span {
    min-width: 0;
    overflow: hidden;
    color: var(--report-text-secondary);
    font-size: 12px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const TimelineDot = styled.div`
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  flex: 0 0 auto;
  border: 1px solid var(--report-border);
  border-radius: 7px;
  background: var(--report-surface);
  color: var(--report-accent);
`;

export const ActivityList = styled.div`
  display: grid;
  gap: 8px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;
  ${railScrollbar}
`;

export const ActivityItem = styled.article<{ $tone: CellTone }>`
  ${({ $tone }) => toneCss($tone)}

  display: grid;
  gap: 2px;
  padding: 11px;
  border: 2px solid var(--tone-border);
  border-radius: 10px;
  background: var(--report-surface-soft);

  strong {
    color: var(--report-text-primary);
    font-size: 13px;
    font-weight: 700;
    line-height: 1.35;
    word-break: keep-all;
  }

  p {
    margin: 0;
    color: var(--report-text-secondary);
    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
    word-break: keep-all;
  }
`;

export const ActivityTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  > span {
    color: var(--report-text-primary);
    font-size: 13px;
    font-weight: 600;
  }
`;

export const ActionStack = styled.div`
  display: grid;
  gap: 8px;
`;

export const WideButton = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid var(--report-accent);
  border-radius: 8px;
  background: var(--report-accent);
  color: var(--report-on-accent);
  font-size: 13px;
  font-weight: 700;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    border-color: var(--report-accent-strong);
    background: var(--report-accent-strong);
  }

  &:focus-visible {
    outline: 3px solid var(--report-focus);
    outline-offset: 2px;
  }
`;

export const WideGhostButton = styled(WideButton)`
  border-color: var(--report-border);
  background: var(--report-surface-soft);
  color: var(--report-text-primary);

  &:hover {
    border-color: var(--report-border-strong);
    background: var(--report-surface-hover);
  }
`;
