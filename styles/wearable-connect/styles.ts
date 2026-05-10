import { WEARABLE_THEME_STYLES } from '@/constants/wearable-connect/constants';
import type { ConnectionStatus, WearableThemeStyle } from '@/types/wearable-connect/types';
import styled, { css, keyframes } from 'styled-components';

const WEARABLE_CLEAN_THEME_STYLES: Record<'light' | 'dark', WearableThemeStyle> = {
  light: {
    ...WEARABLE_THEME_STYLES.light,
    background: '#f7f8fa',
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
    success: '#16a34a',
    successSoft: 'rgba(22, 163, 74, 0.08)',
    warning: '#f59e0b',
    warningSoft: 'rgba(245, 158, 11, 0.08)',
    error: '#ef4444',
    errorSoft: 'rgba(239, 68, 68, 0.08)',
    shadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
    focus: 'rgba(37, 99, 235, 0.18)',
    overlay: 'rgba(15, 23, 42, 0.56)',
  },
  dark: {
    ...WEARABLE_THEME_STYLES.dark,
    background: '#141414',
    surface: '#181818',
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
    successSoft: 'rgba(22, 163, 74, 0.14)',
    warning: '#f59e0b',
    warningSoft: 'rgba(245, 158, 11, 0.14)',
    error: '#ef4444',
    errorSoft: 'rgba(239, 68, 68, 0.14)',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.28)',
    focus: 'rgba(37, 99, 235, 0.28)',
    overlay: 'rgba(0, 0, 0, 0.72)',
  },
};

const STATUS_TONE_VARS: Record<
  ConnectionStatus,
  {
    color: string;
    border: string;
    background: string;
  }
> = {
  idle: {
    color: 'var(--wearable-text-secondary)',
    border: 'var(--wearable-border)',
    background: 'var(--wearable-surface-muted)',
  },
  checking: {
    color: 'var(--wearable-accent)',
    border: 'var(--wearable-accent)',
    background: 'var(--wearable-surface)',
  },
  ok: {
    color: 'var(--wearable-success)',
    border: 'var(--wearable-success)',
    background: 'var(--wearable-surface)',
  },
  error: {
    color: 'var(--wearable-error)',
    border: 'var(--wearable-error)',
    background: 'var(--wearable-surface)',
  },
};

const createWearableThemeVars = (theme: WearableThemeStyle) => css`
  --wearable-bg: ${theme.background};

  --wearable-surface: ${theme.surface};
  --wearable-surface-muted: ${theme.surfaceMuted};
  --wearable-surface-hover: ${theme.surfaceHover};

  --wearable-border: ${theme.border};
  --wearable-border-strong: ${theme.borderStrong};

  --wearable-text-primary: ${theme.textPrimary};
  --wearable-text-secondary: ${theme.textSecondary};
  --wearable-text-tertiary: ${theme.textTertiary};

  --wearable-accent: ${theme.accent};
  --wearable-accent-soft: ${theme.accentSoft};
  --wearable-on-accent: ${theme.onAccent};

  --wearable-success: ${theme.success};
  --wearable-success-soft: ${theme.successSoft};

  --wearable-warning: ${theme.warning};
  --wearable-warning-soft: ${theme.warningSoft};

  --wearable-error: ${theme.error};
  --wearable-error-soft: ${theme.errorSoft};

  --wearable-shadow: ${theme.shadow};
  --wearable-focus: ${theme.focus};
  --wearable-overlay: ${theme.overlay};
`;

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const popIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const ThemeScope = styled.div<{ $isDark: boolean }>`
  height: 100%;
  min-height: 100dvh;

  ${({ $isDark }) =>
    createWearableThemeVars(
      $isDark ? WEARABLE_CLEAN_THEME_STYLES.dark : WEARABLE_CLEAN_THEME_STYLES.light,
    )}
`;

const buttonReset = css`
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

export const PageShell = styled.main`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 22px;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  padding: 28px;
  background: var(--wearable-bg);
  color: var(--wearable-text-primary);
  font-family:
    'Pretendard Variable',
    'Pretendard',
    -apple-system,
    BlinkMacSystemFont,
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    sans-serif;

  @media (max-width: 768px) {
    gap: 16px;
    padding: 16px;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  min-height: 0;
  flex: 0 0 auto;

  @media (max-width: 1080px) {
    flex-direction: column;
  }
`;

export const TitleBlock = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

export const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 30px;
  padding: 0 12px;
  border: 1px solid var(--wearable-border);
  border-radius: 8px;
  background: var(--wearable-surface);
  color: var(--wearable-accent);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: var(--wearable-text-primary);
  font-size: clamp(30px, 2.7vw, 30px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
`;

export const Description = styled.p`
  max-width: 760px;
  margin: 0;
  color: var(--wearable-text-secondary);
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  word-break: keep-all;
  margin-bottom: 10px;
`;

export const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  flex: 0 0 auto;
`;

export const MetaPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid var(--wearable-border);
  border-radius: 8px;
  background: var(--wearable-surface);
  color: var(--wearable-text-secondary);
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;

  strong {
    color: var(--wearable-text-primary);
    font-weight: 700;
  }
`;

export const ContentGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(460px, 520px) minmax(0, 1fr);
  gap: 22px;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(220px, 36vh) minmax(0, 1fr);
  }
`;

export const ControlPanel = styled.aside`
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;

export const StreamPanel = styled.section`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  min-height: 0;
  overflow: hidden;
  padding: 20px;
  border: 1px solid var(--wearable-border);
  border-radius: 8px;
  background: var(--wearable-surface);
  box-shadow: var(--wearable-shadow);
`;

export const PanelHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
  min-width: 0;
  min-height: 0;
`;

export const PanelTitleGroup = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
  max-width: 100%;
`;

export const PanelTitle = styled.h2`
  margin: 0;
  overflow-wrap: normal;
  color: var(--wearable-text-primary);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.04em;
  white-space: nowrap;
`;

export const PanelCaption = styled.p`
  margin: 0;
  color: var(--wearable-text-secondary);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.55;
  word-break: keep-all;
`;

export const PanelActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
  min-width: 0;
  flex-wrap: wrap;

  > button {
    flex: 1 1 128px;
    min-height: 38px;
    padding: 0 12px;
  }
`;

export const ScannerCard = styled.div`
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--wearable-border);
  border-radius: 12px;
  background: var(--wearable-surface);
  box-shadow: var(--wearable-shadow);
`;

export const ScannerTop = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
`;

export const ScannerIcon = styled.div`
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border: 1px solid var(--wearable-border);
  border-radius: 8px;
  background: var(--wearable-surface-muted);
  color: var(--wearable-accent);
`;

export const ScannerTextGroup = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

export const ScannerTitle = styled.div`
  color: var(--wearable-text-primary);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
`;

export const ScannerDesc = styled.div`
  color: var(--wearable-text-secondary);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.45;
  word-break: keep-all;
`;

export const ScanInputGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(132px, 1.2fr) repeat(2, minmax(88px, 0.8fr)) minmax(82px, 0.7fr) auto;
  gap: 10px;
  align-items: end;

  @media (max-width: 680px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const ScanHelp = styled.div`
  color: var(--wearable-text-tertiary);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
`;

export const ScanProgress = styled.div`
  display: grid;
  gap: 8px;
`;

export const ProgressText = styled.div`
  color: var(--wearable-text-secondary);
  font-size: 13px;
  font-weight: 700;
`;

export const ProgressTrack = styled.div`
  height: 8px;
  overflow: hidden;
  border: 1px solid var(--wearable-border);
  border-radius: 4px;
  background: var(--wearable-surface-muted);
`;

export const ProgressFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  border-radius: 4px;
  background: var(--wearable-accent);
  transition: width 180ms ease;
`;

export const ScanResultBox = styled.div`
  display: grid;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--wearable-border);
  border-radius: 10px;
  background: var(--wearable-surface-muted);
`;

export const ScanResultTitle = styled.div`
  color: var(--wearable-text-primary);
  font-size: 14px;
  font-weight: 700;
`;

export const ScanEmptyText = styled.div`
  color: var(--wearable-text-secondary);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
`;

export const ScanResultList = styled.div`
  display: grid;
  gap: 8px;
  max-height: 260px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: var(--wearable-border-strong);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const ScanResultItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 36px;
  padding: 0 8px 0 12px;
  border: 1px solid var(--wearable-border);
  border-radius: 8px;
  background: var(--wearable-surface);

  span {
    min-width: 0;
    overflow: hidden;
    color: var(--wearable-text-primary);
    font-family:
      'SFMono-Regular',
      ui-monospace,
      Menlo,
      Monaco,
      Consolas,
      'Liberation Mono',
      'Courier New',
      monospace;
    font-size: 13px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button {
    ${buttonReset};

    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 28px;
    padding: 0 10px;
    border-radius: 8px;
    background: var(--wearable-accent);
    color: var(--wearable-on-accent);
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }
`;

export const AddCard = styled.div`
  display: grid;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--wearable-border);
  border-radius: 12px;
  background: var(--wearable-surface);
  box-shadow: var(--wearable-shadow);
`;

export const AddTitle = styled.div`
  color: var(--wearable-text-primary);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

export const AddInputGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  align-items: end;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.label`
  display: grid;
  gap: 7px;
  min-width: 0;
`;

export const InputLabel = styled.span`
  color: var(--wearable-text-secondary);
  font-size: 13px;
  font-weight: 700;
`;

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  height: 44px;
  overflow: hidden;
  border: 1px solid var(--wearable-border);
  border-radius: 8px;
  background: var(--wearable-surface-muted);
  transition:
    border-color 160ms ease,
    background 160ms ease;

  &:focus-within {
    border-color: var(--wearable-accent);
    background: var(--wearable-surface);
  }
`;

export const PrefixText = styled.span`
  padding-left: 12px;
  color: var(--wearable-text-tertiary);
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
`;

export const NumberInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 44px;
  padding: 0 12px;
  border: 1px solid var(--wearable-border);
  border-radius: 8px;
  outline: none;
  background: var(--wearable-surface-muted);
  color: var(--wearable-text-primary);
  font-size: 15px;
  font-weight: 700;
  transition:
    border-color 160ms ease,
    background 160ms ease;

  ${InputRow} & {
    height: 100%;
    padding-left: 4px;
    border: 0;
    border-radius: 0;
    background: transparent;
  }

  &:focus {
    border-color: var(--wearable-accent);
    background: var(--wearable-surface);
  }

  &::placeholder {
    color: var(--wearable-text-tertiary);
  }
`;

export const TextInput = styled(NumberInput)`
  font-family:
    'SFMono-Regular',
    ui-monospace,
    Menlo,
    Monaco,
    Consolas,
    'Liberation Mono',
    'Courier New',
    monospace;
`;

export const FormError = styled.div`
  padding: 10px 12px;
  border: 1px solid var(--wearable-error);
  border-radius: 8px;
  background: var(--wearable-surface-muted);
  color: var(--wearable-error);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
`;

export const TargetList = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 2px 4px 2px 0;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: var(--wearable-border-strong);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const TargetCard = styled.article<{
  $status: ConnectionStatus;
  $selected: boolean;
}>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  padding: 9px 10px 9px 12px;
  border: 1px solid
    ${({ $selected }) =>
      $selected ? 'var(--wearable-accent)' : 'var(--wearable-border)'};
  border-radius: 10px;
  background: ${({ $selected }) =>
    $selected ? 'var(--wearable-surface-hover)' : 'var(--wearable-surface)'};
  box-shadow: ${({ $selected }) =>
    $selected ? 'inset 3px 0 0 var(--wearable-accent)' : 'var(--wearable-shadow)'};
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $selected }) =>
      $selected ? 'var(--wearable-accent)' : 'var(--wearable-border-strong)'};
    background: var(--wearable-surface-hover);
  }

  @container (max-width: 430px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
`;

export const TargetMain = styled.div`
  display: grid;
  gap: 3px;
  min-width: 0;
`;

export const TargetTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
`;

export const TargetTitleGroup = styled.div`
  display: grid;
  gap: 2px;
  min-width: 0;
`;

export const TargetName = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: var(--wearable-text-primary);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;

  span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const TargetAddress = styled.div`
  min-width: 0;
  overflow: hidden;
  color: var(--wearable-text-secondary);
  font-size: 12px;
  font-weight: 600;
  margin: 4px 0;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TargetDescription = styled.div`
  min-width: 0;
  overflow: hidden;
  color: var(--wearable-text-tertiary);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TargetActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  flex-wrap: nowrap;

  @container (max-width: 430px) {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
`;

export const StatusDot = styled.span<{ $status: ConnectionStatus }>`
  width: 9px;
  height: 9px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: ${({ $status }) => STATUS_TONE_VARS[$status].color};
  animation: ${({ $status }) => ($status === 'checking' ? spin : 'none')} 900ms
    linear infinite;
`;

export const StatusBadge = styled.span<{ $status: ConnectionStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid ${({ $status }) => STATUS_TONE_VARS[$status].border};
  border-radius: 4px;
  background: ${({ $status }) => STATUS_TONE_VARS[$status].background};
  color: ${({ $status }) => STATUS_TONE_VARS[$status].color};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

export const ButtonBase = styled.button`
  ${buttonReset};

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  min-height: 30px;
  padding: 0 9px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease,
    opacity 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.46;
  }

  &:focus-visible {
    outline: 3px solid var(--wearable-focus);
    outline-offset: 2px;
  }
`;

export const SecondaryButton = styled(ButtonBase)`
  border: 1px solid var(--wearable-border);
  background: var(--wearable-surface);
  color: var(--wearable-text-secondary);

  &:hover:not(:disabled) {
    border-color: var(--wearable-border-strong);
    background: var(--wearable-surface-hover);
    color: var(--wearable-text-primary);
  }
`;

export const ToolButton = styled(SecondaryButton)`
  flex: 1 1 132px;
  min-height: 38px;
  padding: 0 13px;
`;

export const PrimaryToolButton = styled(ButtonBase)`
  flex: 1 1 132px;
  min-height: 38px;
  padding: 0 13px;
  border: 1px solid var(--wearable-accent);
  background: var(--wearable-accent);
  color: var(--wearable-on-accent);
`;

export const GhostButton = styled(ButtonBase)`
  border: 1px solid var(--wearable-border);
  background: var(--wearable-surface-muted);
  color: var(--wearable-text-secondary);

  &:hover:not(:disabled) {
    border-color: var(--wearable-border-strong);
    background: var(--wearable-surface-hover);
    color: var(--wearable-text-primary);
  }
`;

export const ConnectButton = styled(ButtonBase)`
  border: 1px solid var(--wearable-accent);
  background: var(--wearable-accent);
  color: var(--wearable-on-accent);
`;

export const DeleteButton = styled(ButtonBase)`
  border: 1px solid var(--wearable-border);
  background: transparent;
  color: var(--wearable-text-tertiary);

  &:hover:not(:disabled) {
    border-color: var(--wearable-error);
    background: var(--wearable-surface-muted);
    color: var(--wearable-error);
  }
`;

export const AddButton = styled(ButtonBase)`
  min-height: 44px;
  border: 1px solid var(--wearable-accent);
  background: var(--wearable-accent);
  color: var(--wearable-on-accent);
`;

export const ScanButton = styled(ButtonBase)`
  min-height: 44px;
  border: 1px solid var(--wearable-accent);
  background: var(--wearable-accent);
  color: var(--wearable-on-accent);
`;

export const StreamHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  min-height: 0;
  flex: 0 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StreamTitleGroup = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
`;

export const StreamTitle = styled.h2`
  margin: 0;
  color: var(--wearable-text-primary);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.04em;
`;

export const StreamCaption = styled.p`
  margin: 0;
  color: var(--wearable-text-secondary);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  word-break: keep-all;
`;

export const StreamHeaderActions = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
`;

export const CurrentAccess = styled.div`
  display: grid;
  justify-items: end;
  gap: 3px;
  flex: 0 0 auto;

  span {
    color: var(--wearable-text-tertiary);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  strong {
    color: var(--wearable-text-primary);
    font-size: 14px;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    justify-items: start;
  }
`;

export const ExpandButton = styled(ButtonBase)`
  gap: 7px;
  min-height: 40px;
  border: 1px solid var(--wearable-border);
  background: var(--wearable-surface-muted);
  color: var(--wearable-text-primary);

  &:hover:not(:disabled) {
    border-color: var(--wearable-accent);
    background: var(--wearable-surface-hover);
    color: var(--wearable-accent);
  }
`;

export const StreamContent = styled.div`
  position: relative;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--wearable-border);
  border-radius: 12px;
  background: var(--wearable-surface-muted);
`;

export const FrameBox = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: #000000;
`;

export const StyledIframe = styled.iframe`
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
`;

export const EmptyStreamState = styled.div`
  display: grid;
  place-items: center;
  align-content: center;
  gap: 14px;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 36px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 24px;
  }
`;

export const EmptyIcon = styled.div`
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  border: 1px solid var(--wearable-warning);
  border-radius: 8px;
  background: var(--wearable-surface-muted);
  color: var(--wearable-warning);
`;

export const EmptyTitle = styled.h3`
  margin: 0;
  color: var(--wearable-text-primary);
  font-size: 26px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.04em;
`;

export const EmptyDesc = styled.p`
  max-width: 560px;
  margin: 0;
  color: var(--wearable-text-secondary);
  font-size: 17px;
  font-weight: 500;
  line-height: 1.7;
  word-break: keep-all;

  strong {
    color: var(--wearable-success);
    font-weight: 700;
  }
`;

export const DialogOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1300;
  display: grid;
  place-items: center;
  padding: 28px;
  background: var(--wearable-overlay);
  animation: ${fadeIn} 180ms ease;

  @media (max-width: 640px) {
    padding: 14px;
  }
`;

export const DialogModal = styled.div<{ $compact?: boolean }>`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: ${({ $compact }) => ($compact ? 'min(540px, 94vw)' : 'min(760px, 94vw)')};
  max-height: min(760px, 88vh);
  overflow: hidden;
  border: 1px solid var(--wearable-border);
  border-radius: 8px;
  background: var(--wearable-surface);
  box-shadow: var(--wearable-shadow);
  animation: ${popIn} 220ms cubic-bezier(0.22, 1, 0.36, 1);
`;

export const DialogHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 22px 22px 18px;
  border-bottom: 1px solid var(--wearable-border);
`;

export const DialogTitleGroup = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
`;

export const DialogEyebrow = styled.div`
  color: var(--wearable-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
`;

export const DialogTitle = styled.h2`
  margin: 0;
  color: var(--wearable-text-primary);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.04em;
`;

export const DialogDescription = styled.p`
  max-width: 560px;
  margin: 0;
  color: var(--wearable-text-secondary);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.6;
  word-break: keep-all;
`;

export const DialogCloseButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  border: 1px solid var(--wearable-border);
  border-radius: 8px;
  background: var(--wearable-surface-muted);
  color: var(--wearable-text-secondary);
  transition:
    transform 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    background: var(--wearable-surface-hover);
    color: var(--wearable-error);
  }

  &:focus-visible {
    outline: 3px solid var(--wearable-focus);
    outline-offset: 2px;
  }
`;

export const DialogBody = styled.div`
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 18px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: var(--wearable-border-strong);
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export const ExpandedOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1400;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  padding: 0;
  background: #000000;
  animation: ${fadeIn} 180ms ease;
`;

export const ExpandedModal = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  border: 0;
  border-radius: 0;
  background: #000000;
  box-shadow: none;
  animation: ${fadeIn} 180ms ease;
`;

export const ExpandedHeader = styled.div`
  position: absolute;
  top: max(16px, env(safe-area-inset-top));
  left: max(16px, env(safe-area-inset-left));
  right: max(16px, env(safe-area-inset-right));
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 64px;
  padding: 0 14px 0 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.72);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.32);

  @media (max-width: 640px) {
    top: max(10px, env(safe-area-inset-top));
    left: max(10px, env(safe-area-inset-left));
    right: max(10px, env(safe-area-inset-right));
    min-height: 56px;
    padding: 0 10px 0 14px;
    border-radius: 10px;
  }
`;

export const ExpandedTitleGroup = styled.div`
  display: grid;
  gap: 3px;
  min-width: 0;
`;

export const ExpandedEyebrow = styled.div`
  overflow: hidden;
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const ExpandedTitle = styled.div`
  min-width: 0;
  overflow: hidden;
  color: #ffffff;
  font-family:
    'SFMono-Regular',
    ui-monospace,
    Menlo,
    Monaco,
    Consolas,
    'Liberation Mono',
    'Courier New',
    monospace;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 13px;
  }
`;

export const ExpandedCloseButton = styled.button`
  ${buttonReset};

  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
  transition:
    transform 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.24);
    color: #ffffff;
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.28);
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    width: 40px;
    height: 40px;
  }
`;

export const ExpandedFrameBox = styled.div`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: #000000;
`;