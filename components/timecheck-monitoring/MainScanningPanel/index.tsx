'use client';

import styled, { css, keyframes } from 'styled-components';

import type { ScannerInfo } from '../model/types';

interface MainScanningPanelProps {
  info: ScannerInfo;
  elapsedLabel: string;
}

export default function MainScanningPanel({
  info,
  elapsedLabel,
}: MainScanningPanelProps) {
  return (
    <Section>
      <TopBar>
        <ViewPill>
          <EyeIcon />
          {info.mainViewLabel}
        </ViewPill>

        <OperatorPill>{info.operatorLabel}</OperatorPill>
      </TopBar>

      <ScannerFrame>
        <Crosshair />

        <ScanTop>
          <ScanTitleGroup>
            <ScanTitle>{info.sectionTitle}</ScanTitle>

            <ScanInfoList>
              <ScanInfoRow>
                <InfoIcon $variant="folder" />
                설비명: {info.equipmentName}
              </ScanInfoRow>

              <ScanInfoRow>
                <InfoIcon $variant="list" />
                점검항목: {info.completedStep}/{info.totalSteps} 완료
              </ScanInfoRow>

              <ScanInfoRow>
                <InfoIcon $variant="clock" />
                경과시간: {elapsedLabel}
              </ScanInfoRow>
            </ScanInfoList>
          </ScanTitleGroup>

          <ResultCard>
            <ResultLabel>
              <StatusDot />
              VLM 분석결과
            </ResultLabel>

            <ResultValue>{info.statusLabel}</ResultValue>
            <ResultMeta>{info.metricLabel}</ResultMeta>
          </ResultCard>
        </ScanTop>

        <BottomMetaRow>
          <MetaCard>
            <MetaLabel>다음 점검</MetaLabel>
            <MetaValue>{info.nextCheck}</MetaValue>
          </MetaCard>

          <MetaCard>
            <MetaLabel>예상 종료</MetaLabel>
            <MetaValue>{info.eta}</MetaValue>
          </MetaCard>
        </BottomMetaRow>
      </ScannerFrame>
    </Section>
  );
}

const softPulse = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0.96);
    opacity: 0.38;
  }

  50% {
    transform: translate(-50%, -50%) scale(1.04);
    opacity: 0.72;
  }

  100% {
    transform: translate(-50%, -50%) scale(0.96);
    opacity: 0.38;
  }
`;

const Section = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  color: var(--color-text-primary);
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const TopPillBase = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 18px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-muted);
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
`;

const ViewPill = styled(TopPillBase)`
  color: var(--color-accent);
`;

const EyeIcon = styled.span`
  position: relative;
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  border: 2px solid var(--color-accent);
  border-radius: 999px;

  &::after {
    position: absolute;
    inset: 3px;
    border-radius: 999px;
    background: var(--color-accent);
    content: '';
  }
`;

const OperatorPill = styled(TopPillBase)`
  color: var(--color-text-secondary);
`;

const ScannerFrame = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  min-height: 360px;
  padding: 24px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 22px;
  background: var(--color-surface);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    min-height: auto;
    padding: 20px;
    border-radius: 18px;
  }
`;

const Crosshair = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 92px;
  height: 92px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  opacity: 0.8;
  pointer-events: none;
  transform: translate(-50%, -50%);

  &::before,
  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 999px;
    background: var(--color-accent);
    content: '';
    animation: ${softPulse} 2.4s ease-in-out infinite;
  }

  &::before {
    width: 44px;
    height: 4px;
  }

  &::after {
    width: 4px;
    height: 44px;
  }
`;

const ScanTop = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  min-width: 0;

  @media (max-width: 980px) {
    flex-direction: column;
  }
`;

const ScanTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
`;

const ScanTitle = styled.div`
  color: var(--color-accent);
  font-size: clamp(34px, 3vw, 60px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
  word-break: keep-all;
`;

const ScanInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ScanInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.35;
  word-break: keep-all;

  @media (max-width: 768px) {
    align-items: flex-start;
    font-size: 18px;
  }
`;

const InfoIcon = styled.span<{ $variant: 'folder' | 'list' | 'clock' }>`
  position: relative;
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  color: var(--color-text-secondary);

  ${({ $variant }) => {
    if ($variant === 'folder') {
      return css`
        &::before {
          position: absolute;
          top: 5px;
          right: 0;
          bottom: 1px;
          left: 0;
          border-radius: 3px;
          background: currentColor;
          content: '';
        }

        &::after {
          position: absolute;
          top: 2px;
          left: 1px;
          width: 8px;
          height: 5px;
          border-radius: 3px 3px 0 0;
          background: currentColor;
          content: '';
        }
      `;
    }

    if ($variant === 'list') {
      return css`
        border-top: 2px solid currentColor;
        border-bottom: 2px solid currentColor;

        &::before {
          position: absolute;
          top: 7px;
          left: 0;
          width: 100%;
          height: 2px;
          border-radius: 999px;
          background: currentColor;
          content: '';
        }
      `;
    }

    return css`
      border: 2px solid currentColor;
      border-radius: 999px;

      &::before {
        position: absolute;
        top: 3px;
        left: 7px;
        width: 2px;
        height: 5px;
        border-radius: 999px;
        background: currentColor;
        content: '';
      }

      &::after {
        position: absolute;
        top: 8px;
        left: 7px;
        width: 5px;
        height: 2px;
        border-radius: 999px;
        background: currentColor;
        content: '';
        transform: rotate(35deg);
        transform-origin: left center;
      }
    `;
  }}
`;

const ResultCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  min-width: 180px;
  padding: 18px 20px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-surface-muted);
  color: var(--color-text-primary);

  @media (max-width: 980px) {
    width: 100%;
  }
`;

const ResultLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.35;
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: var(--color-success);
`;

const ResultValue = styled.div`
  color: var(--color-success);
  font-size: 28px;
  font-weight: 900;
  line-height: 1.2;
  letter-spacing: -0.03em;
  word-break: keep-all;
`;

const ResultMeta = styled.div`
  color: var(--color-text-primary);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  word-break: keep-all;
`;

const BottomMetaRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 12px;
  min-width: 0;

  > * {
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 980px) {
    flex-direction: column;
  }
`;

const MetaCard = styled.div`
  display: flex;
  height: 126px;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 8px 24px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface-muted);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    height: auto;
    min-height: 96px;
    padding: 18px;
  }
`;

const MetaLabel = styled.div`
  color: var(--color-text-secondary);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.35;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const MetaValue = styled.div`
  color: var(--color-text-primary);
  font-size: 28px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.03em;
  word-break: keep-all;

  @media (max-width: 768px) {
    font-size: 22px;
  }
`;