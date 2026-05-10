import { STATUS_META } from '@/model/action-history/constants';
import { ActionStatus } from '@/model/action-history/types';
import Link from 'next/link';
import styled, { css, keyframes } from 'styled-components';

export const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;
export const skeletonPulse = keyframes`
  0%,
  100% {
    opacity: 0.55;
  }

  50% {
    opacity: 1;
  }
`;
export const pop = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
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
export const oneLine = css`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PageShell = styled.main`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 16px;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  padding: 22px;
  background: var(--history-bg);
  color: var(--history-text-primary);
  @media (max-height: 860px) and (min-width: 981px) {
    gap: 12px;
    padding: 16px;
  }
  @media (max-width: 768px) {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding: 14px;
  }
`;
export const ContentFrame = styled.section`
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 12px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  @media (max-width: 980px) {
    overflow: visible;
  }
`;
export const PageHero = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border: 1px solid var(--history-border);
  border-radius: 14px;
  background: var(--history-surface-elevated);
  box-shadow: var(--history-shadow);
  @media (max-height: 860px) and (min-width: 981px) {
    padding: 14px 16px;
  }
  @media (max-width: 980px) {
    flex-direction: column;
  }
`;
export const HeroTextGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;
export const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 26px;
  padding: 0 10px;
  border: 1px solid var(--history-border);
  border-radius: 8px;
  background: var(--history-surface-muted);
  color: var(--history-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;
export const PageTitle = styled.h1`
  margin: 0;
  color: var(--history-text-primary);
  font-size: clamp(25px, 2.1vw, 28px);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.045em;
`;
export const PageDescription = styled.p`
  max-width: 820px;
  margin: 0;
  color: var(--history-text-secondary);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.55;
  word-break: keep-all;
`;
export const ContextSwitch = styled.nav`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--history-border);
  border-radius: 10px;
  background: var(--history-surface-muted);
`;
export const ContextLink = styled(Link)<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? 'var(--history-surface)' : 'transparent')};
  color: ${({ $active }) =>
    $active ? 'var(--history-text-primary)' : 'var(--history-text-secondary)'};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: ${({ $active }) => ($active ? 'var(--history-shadow)' : 'none')};
  transition:
    background 160ms ease,
    color 160ms ease;
  &:hover {
    color: var(--history-text-primary);
  }
`;
export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 58px;
  padding: 9px;
  border: 1px solid var(--history-border);
  border-radius: 14px;
  background: var(--history-surface);
  box-shadow: var(--history-shadow);
  @media (max-width: 980px) {
    align-items: stretch;
    flex-direction: column;
  }
`;
export const SearchBox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: min(520px, 100%);
  min-height: 42px;
  padding: 0 13px;
  border: 1px solid var(--history-border);
  border-radius: 10px;
  background: var(--history-surface-muted);
  color: var(--history-text-tertiary);
  transition:
    border-color 160ms ease,
    background 160ms ease;
  &:focus-within {
    border-color: var(--history-accent);
    background: var(--history-surface);
  }
  input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--history-text-primary);
    font-size: 14px;
    font-weight: 500;
    &::placeholder {
      color: var(--history-text-tertiary);
    }
  }
`;
export const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
  @media (max-width: 980px) {
    justify-content: flex-start;
  }
`;
export const MainGrid = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(330px, 390px);
  gap: 14px;
  min-height: 0;
  overflow: hidden;
  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
    padding-right: 2px;
  }
`;
export const LeftPanel = styled.div`
  min-width: 0;
  min-height: 0;
  overflow: hidden;
`;
export const RightSummaryPanel = styled.aside`
  display: grid;
  grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  @media (max-width: 1180px) {
    grid-template-rows: auto auto;
  }
`;
export const ButtonBase = styled.button`
  ${buttonReset};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 38px;
  padding: 0 13px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease,
    opacity 160ms ease;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.58;
  }
  .spinner {
    animation: ${spin} 900ms linear infinite;
  }
`;
export const GhostButton = styled(ButtonBase)`
  border: 1px solid var(--history-border);
  background: var(--history-surface);
  color: var(--history-text-primary);
  &:hover:not(:disabled) {
    border-color: var(--history-border-strong);
    background: var(--history-surface-hover);
  }
`;
export const PrimaryButton = styled(ButtonBase)`
  border: 1px solid var(--history-accent);
  background: var(--history-accent);
  color: var(--history-on-accent);
  &:hover:not(:disabled) {
    filter: brightness(0.96);
  }
`;

export const SummaryPanel = styled.section`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  padding: 16px;
  border: 1px solid var(--history-border);
  border-radius: 14px;
  background: var(--history-surface);
  box-shadow: var(--history-shadow);
`;
export const SummaryPanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;
export const SummaryTitleGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
`;
export const SummaryIcon = styled.div`
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  border: 1px solid var(--history-border);
  border-radius: 8px;
  background: var(--history-surface-muted);
  color: var(--history-accent);
`;
export const SummaryTitle = styled.h2`
  margin: 0;
  color: var(--history-text-primary);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.03em;
`;
export const SummaryCaption = styled.p`
  margin: 2px 0 0;
  color: var(--history-text-secondary);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.45;
`;
export const MiniDownloadButton = styled(GhostButton)`
  min-height: 32px;
  padding: 0 10px;
  font-size: 12px;

  &:disabled {
    border-color: var(--history-border);
    background: var(--history-surface-muted);
    color: var(--history-text-tertiary);
    opacity: 0.48;
  }
`;
export const SummaryTableWrapper = styled.div`
  min-width: 0;
  min-height: 0;
  overflow: auto;
  border: 1px solid var(--history-border);
  border-radius: 10px;
`;
export const SummaryTable = styled.table`
  width: 100%;
  min-width: 560px;
  border-collapse: collapse;
  color: var(--history-text-primary);
  font-size: 13px;
  th,
  td {
    padding: 11px 10px;
    border-bottom: 1px solid var(--history-border);
    text-align: right;
    vertical-align: middle;
  }
  th:first-child,
  td:first-child {
    text-align: left;
  }
  thead th {
    position: sticky;
    top: 0;
    z-index: 1;
    background: var(--history-surface-muted);
    color: var(--history-text-secondary);
    font-weight: 700;
  }
  tbody td {
    color: var(--history-text-primary);
    font-weight: 600;
  }
  tbody tr:last-child td {
    border-bottom: 0;
  }
`;
export const DurationBucketList = styled.div`
  display: grid;
  align-content: start;
  gap: 9px;
  min-height: 0;
  overflow-y: auto;
`;
export const DurationBucket = styled.div`
  display: grid;
  gap: 7px;
  padding: 12px;
  border: 1px solid var(--history-border);
  border-radius: 10px;
  background: var(--history-surface-muted);
`;
export const BucketTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  strong {
    color: var(--history-text-primary);
    font-size: 14px;
    font-weight: 700;
  }
  span {
    color: var(--history-accent);
    font-size: 13px;
    font-weight: 700;
  }
`;
export const BucketMeta = styled.div`
  color: var(--history-text-secondary);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.45;
`;
export const BucketTrack = styled.div`
  height: 7px;
  overflow: hidden;
  border: 1px solid var(--history-border);
  border-radius: 999px;
  background: var(--history-surface);
`;
export const BucketFill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  border-radius: 999px;
  background: var(--history-accent);
`;

export const SummaryEmptyState = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  align-content: center;
  justify-items: center;
  gap: 12px;
  min-width: 0;
  min-height: 220px;
  height: 100%;
  overflow: hidden;
  padding: 24px 18px;
  border: 1px solid var(--history-border);
  border-radius: 10px;
  background: var(--history-surface-muted);
  color: var(--history-text-primary);
  text-align: center;

  /* &::before {
    position: absolute;
    top: 14px;
    bottom: 14px;
    left: 0;
    width: 3px;
    background: var(--history-accent);
    content: '';
  } */

  @media (max-height: 860px) and (min-width: 981px) {
    min-height: 180px;
    padding: 18px 14px;
  }
`;

export const SummaryEmptyIconFrame = styled.div`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--history-accent);
  border-radius: 10px;
  background: var(--history-surface);
  color: var(--history-accent);
  box-shadow: var(--history-shadow);
`;

export const SummaryEmptyContent = styled.div`
  display: grid;
  justify-items: center;
  gap: 6px;
  max-width: 310px;
  min-width: 0;
`;

export const SummaryEmptyEyebrow = styled.div`
  color: var(--history-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1;
  text-transform: uppercase;
`;

export const SummaryEmptyTitle = styled.div`
  color: var(--history-text-primary);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.03em;
  word-break: keep-all;
`;

export const SummaryEmptyDescription = styled.p`
  margin: 0;
  color: var(--history-text-secondary);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.55;
  word-break: keep-all;
`;

export const SummaryEmptyBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid var(--history-border);
  border-radius: 8px;
  background: var(--history-surface);
  color: var(--history-text-secondary);
  box-shadow: var(--history-shadow);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;

  &::before {
    width: 6px;
    height: 6px;
    margin-right: 8px;
    border-radius: 50%;
    background: var(--history-accent);
    content: '';
  }
`;

export const HistorySection = styled.section`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
  min-width: 0;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding: 16px;
  border: 1px solid var(--history-border);
  border-radius: 14px;
  background: var(--history-surface);
  box-shadow: var(--history-shadow);
`;
export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;
export const SectionTitleGroup = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;
export const SectionTitle = styled.h2`
  margin: 0;
  color: var(--history-text-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.28;
  letter-spacing: -0.035em;
`;
export const SectionCaption = styled.p`
  max-width: 860px;
  margin: 0;
  color: var(--history-text-secondary);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
  word-break: keep-all;
`;
export const ResultCount = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 11px;
  border: 1px solid var(--history-border);
  border-radius: 8px;
  background: var(--history-surface-muted);
  color: var(--history-text-secondary);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  strong {
    color: var(--history-text-primary);
    font-weight: 700;
  }
`;
export const HistoryList = styled.div`
  display: grid;
  align-content: start;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 2px;
`;
export const HistoryCard = styled.article<{ $clickable?: boolean }>`
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 14px;
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--history-border);
  border-radius: 12px;
  background: var(--history-surface-muted);
  color: var(--history-text-primary);
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition:
    border-color 160ms ease,
    background 160ms ease;
  &:hover {
    border-color: var(--history-border-strong);
    background: var(--history-surface-hover);
  }
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;
export const Thumb = styled.div`
  min-width: 0;
  overflow: hidden;
  aspect-ratio: 16/10;
  border: 1px solid var(--history-border);
  border-radius: 10px;
  background: #000;
  .thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
export const HistoryCardBody = styled.div`
  display: grid;
  gap: 10px;
  min-width: 0;
`;
export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;
export const CardTitleGroup = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;
export const CardTitle = styled.h3`
  ${oneLine};
  margin: 0;
  color: var(--history-text-primary);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.03em;
`;
export const CardMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--history-text-tertiary);
  font-size: 12px;
  font-weight: 600;
  .sep {
    color: var(--history-border-strong);
  }
`;
export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;
export const InfoItem = styled.div`
  min-width: 0;
  padding: 9px 10px;
  border: 1px solid var(--history-border);
  border-radius: 8px;
  background: var(--history-surface);
  span {
    display: block;
    margin-bottom: 3px;
    color: var(--history-text-tertiary);
    font-size: 11px;
    font-weight: 700;
  }
  strong {
    ${oneLine};
    display: block;
    color: var(--history-text-primary);
    font-size: 13px;
    font-weight: 700;
  }
`;
export const PhenomenonLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 9px 10px;
  border: 1px solid var(--history-border);
  border-radius: 8px;
  background: var(--history-surface);
  span {
    flex: 0 0 auto;
    color: var(--history-text-tertiary);
    font-size: 12px;
    font-weight: 700;
  }
  strong {
    ${oneLine};
    color: var(--history-text-primary);
    font-size: 13px;
    font-weight: 700;
  }
`;
export const DescWrapper = styled.div`
  display: grid;
  gap: 7px;
  min-width: 0;
`;
export const TextContainer = styled.div<{ $expanded: boolean; $isWaiting: boolean }>`
  display: -webkit-box;
  min-width: 0;
  max-height: ${({ $expanded }) => ($expanded ? 'none' : '44px')};
  overflow: hidden;
  color: ${({ $isWaiting }) =>
    $isWaiting ? 'var(--history-accent)' : 'var(--history-text-secondary)'};
  font-size: 13px;
  font-weight: ${({ $isWaiting }) => ($isWaiting ? 700 : 500)};
  line-height: 1.55;
  word-break: break-word;
  white-space: pre-wrap;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ $expanded }) => ($expanded ? 'unset' : '2')};
`;
export const ToggleButton = styled.button`
  ${buttonReset};
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  width: fit-content;
  color: var(--history-accent);
  font-size: 12px;
  font-weight: 700;
`;
export const CardActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;
export const VideoBtn = styled(ButtonBase)<{ $ready: boolean }>`
  border: 1px solid ${({ $ready }) => ($ready ? 'var(--history-success)' : 'var(--history-border)')};
  background: ${({ $ready }) =>
    $ready ? 'var(--history-success-soft)' : 'var(--history-surface)'};
  color: ${({ $ready }) => ($ready ? 'var(--history-success)' : 'var(--history-text-tertiary)')};
`;
export const ReportButton = styled(GhostButton)`
  color: var(--history-danger);
`;
export const StatusPill = styled.span<{ $status: ActionStatus }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 9px;
  border: 1px solid ${({ $status }) => STATUS_META[$status].border};
  border-radius: 8px;
  background: ${({ $status }) => STATUS_META[$status].background};
  color: ${({ $status }) => STATUS_META[$status].color};
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
`;
export const EmptyBox = styled.div`
  display: grid;
  place-items: center;
  min-height: 260px;
  padding: 28px;
  border: 1px dashed var(--history-border-strong);
  border-radius: 12px;
  background: var(--history-surface-muted);
  color: var(--history-text-secondary);
  font-size: 15px;
  font-weight: 600;
  text-align: center;
`;
export const SkeletonThumb = styled.div`
  min-width: 0;
  overflow: hidden;
  aspect-ratio: 16/10;
  border-radius: 10px;
  background: var(--history-skeleton);
  animation: ${skeletonPulse} 1.2s ease-in-out infinite;
`;
export const SkeletonLine = styled.div<{ $width: string; $height: string }>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  border-radius: 8px;
  background: var(--history-skeleton);
  animation: ${skeletonPulse} 1.2s ease-in-out infinite;
`;

export const ModalDim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1400;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--history-overlay);
`;
export const DetailModalFrame = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: min(940px, 100%);
  max-height: min(820px, 92vh);
  overflow: hidden;
  border: 1px solid var(--history-border);
  border-radius: 16px;
  background: var(--history-surface);
  color: var(--history-text-primary);
  box-shadow: var(--history-shadow-strong);
  animation: ${pop} 160ms ease both;
`;
export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 20px 22px;
  border-bottom: 1px solid var(--history-border);
  background: var(--history-surface);
`;
export const ModalTitleGroup = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
`;
export const ModalEyebrow = styled.div`
  color: var(--history-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;
export const ModalTitle = styled.h2`
  margin: 0;
  color: var(--history-text-primary);
  font-size: clamp(21px, 2vw, 28px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.04em;
  word-break: keep-all;
`;
export const CloseButton = styled.button`
  ${buttonReset};
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border: 1px solid var(--history-border);
  border-radius: 10px;
  background: var(--history-surface-muted);
  color: var(--history-text-secondary);
  &:hover {
    border-color: var(--history-border-strong);
    background: var(--history-surface-hover);
    color: var(--history-text-primary);
  }
`;
export const ModalBody = styled.div`
  display: grid;
  gap: 14px;
  min-height: 0;
  overflow-y: auto;
  padding: 20px 22px;
`;
export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;
export const DetailItem = styled.div`
  display: grid;
  gap: 5px;
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--history-border);
  border-radius: 10px;
  background: var(--history-surface-muted);
  span {
    color: var(--history-text-tertiary);
    font-size: 12px;
    font-weight: 700;
  }
  strong {
    min-width: 0;
    color: var(--history-text-primary);
    font-size: 14px;
    font-weight: 700;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
`;
export const DetailSection = styled.section`
  display: grid;
  gap: 8px;
`;
export const DetailSectionTitle = styled.h3`
  margin: 0;
  color: var(--history-text-primary);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
`;
export const DetailText = styled.div`
  min-height: 72px;
  padding: 13px 14px;
  border: 1px solid var(--history-border);
  border-radius: 10px;
  background: var(--history-surface-muted);
  color: var(--history-text-secondary);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
`;
export const VideoBox = styled.video`
  width: 100%;
  max-height: 440px;
  overflow: hidden;
  border: 1px solid var(--history-border);
  border-radius: 10px;
  background: #000;
`;
export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 22px 20px;
  border-top: 1px solid var(--history-border);
`;
export const VideoModalFrame = styled.div`
  display: flex;
  flex-direction: column;
  width: min(1200px, 92vw);
  max-height: min(840px, 92vh);
  overflow: hidden;
  border: 1px solid var(--history-border);
  border-radius: 16px;
  background: var(--history-surface);
  color: var(--history-text-primary);
  box-shadow: var(--history-shadow-strong);
  animation: ${pop} 160ms ease both;
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 68px;
    padding: 0 20px;
    border-bottom: 1px solid var(--history-border);
    background: var(--history-surface);
    h3 {
      ${oneLine};
      margin: 0;
      color: var(--history-text-primary);
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.04em;
    }
  }
  .modal-body {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 0;
    padding: 0;
    background: #000;
    .video-container {
      width: 100%;
      aspect-ratio: 16/9;
      max-height: calc(92vh - 68px);
      background: #000;
      video {
        display: block;
        width: 100%;
        height: 100%;
        outline: none;
      }
    }
  }
`;
export const NetworkModalDim = styled(ModalDim)`
  z-index: 1500;
`;
export const NetworkModalFrame = styled.div`
  display: grid;
  justify-items: center;
  width: min(520px, 100%);
  padding: 30px;
  border: 1px solid var(--history-border);
  border-radius: 16px;
  background: var(--history-surface);
  color: var(--history-text-primary);
  text-align: center;
  box-shadow: var(--history-shadow-strong);
  animation: ${pop} 160ms ease both;
`;
export const NetworkIcon = styled.div`
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  margin-bottom: 16px;
  border: 1px solid var(--history-danger);
  border-radius: 12px;
  background: var(--history-danger-soft);
  color: var(--history-danger);
  svg {
    width: 32px;
    height: 32px;
  }
`;
export const NetworkTitle = styled.h2`
  margin: 0;
  color: var(--history-text-primary);
  font-size: 23px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.04em;
  word-break: keep-all;
`;
export const NetworkText = styled.p`
  margin: 12px 0 0;
  color: var(--history-text-secondary);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;
  word-break: keep-all;
`;
export const NetworkDetail = styled.div`
  width: 100%;
  margin-top: 16px;
  padding: 12px 14px;
  border: 1px solid var(--history-border);
  border-radius: 10px;
  background: var(--history-surface-muted);
  color: var(--history-text-tertiary);
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
  text-align: left;
  overflow-wrap: anywhere;
`;
export const NetworkActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 22px;
`;

export const DetailModal = DetailModalFrame;
export const VideoModal = VideoModalFrame;
export const NetworkModal = NetworkModalFrame;
