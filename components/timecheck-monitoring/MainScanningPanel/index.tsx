'use client';

import styled, { css, keyframes } from 'styled-components';
import { ScannerInfo } from '../model/types';

interface MainScanningPanelProps {
  info: ScannerInfo;
  elapsedLabel: string;
}

const softPulse = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0.98);
    opacity: 0.45;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.04);
    opacity: 0.82;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.98);
    opacity: 0.45;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column; /* 세로 배치 */
  gap: 12px;
  flex: 1; /* 부모 컨테이너 영역을 가득 채우도록 추가 */
  min-height: 0;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

const ViewPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(112, 150, 233, 0.22);
  background: rgba(15, 35, 78, 0.82);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  font-size: 14px;
  font-weight: 800;
  color: var(--monitor-white);
`;

const EyeIcon = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.92);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 999px;
    background: var(--monitor-blue);
    box-shadow: 0 0 12px rgba(98, 163, 255, 0.7);
  }
`;

const OperatorPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(112, 150, 233, 0.18);
  background: #130f40;
  color: var(--monitor-white);
  font-size: 14px;
  font-weight: 800;
`;

const ScannerFrame = styled.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 위아래로 요소들을 끝에 붙임 (grid-template-rows 역할 대체) */
  gap: 18px;
  border-radius: 18px;
  border: 1px solid rgba(129, 166, 240, 0.22);
  background: rgba(0,0,0,0.3);
  padding: 24px 24px 24px;
`;

const Crosshair = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 92px;
  height: 92px;
  transform: translate(-50%, -50%);
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    background: rgba(148, 174, 236, 0.28);
    border-radius: 999px;
    animation: ${softPulse} 2.4s ease-in-out infinite;
  }

  &::before {
    width: 44px;
    height: 6px;
    transform: translate(-50%, -50%);
  }

  &::after {
    width: 6px;
    height: 44px;
    transform: translate(-50%, -50%);
  }
`;

const ScanTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
`;

const ScanTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ScanTitle = styled.div`
  font-size: clamp(34px, 3vw, 60px);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1;
  color: rgba(117, 170, 255, 0.94);
  text-shadow: 0 0 30px rgba(95, 155, 255, 0.22);
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
  color: var(--monitor-white);
  font-size: 24px;
  font-weight: 600;
`;

const InfoIcon = styled.span<{ $variant: 'folder' | 'list' | 'clock' }>`
  /* ... 기존 코드와 동일 ... */
  width: 18px;
  height: 18px;
  position: relative;
  flex-shrink: 0;
  opacity: 0.96;

  ${({ $variant }) => {
    if ($variant === 'folder') {
      return css`
        &::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 1px;
          top: 5px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.94);
        }

        &::after {
          content: '';
          position: absolute;
          left: 1px;
          top: 2px;
          width: 8px;
          height: 5px;
          border-radius: 2px 2px 0 0;
          background: rgba(255, 255, 255, 0.94);
        }
      `;
    }

    if ($variant === 'list') {
      return css`
        &::before,
        &::after {
          content: '';
          position: absolute;
          left: 5px;
          right: 0;
          height: 2px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.94);
        }

        &::before {
          top: 5px;
          box-shadow: 0 5px 0 rgba(255, 255, 255, 0.94), 0 10px 0 rgba(255, 255, 255, 0.94);
        }

        &::after {
          display: none;
        }
      `;
    }

    return css`
      border-radius: 999px;
      border: 2px solid rgba(255, 255, 255, 0.94);

      &::before {
        content: '';
        position: absolute;
        width: 2px;
        height: 5px;
        left: 8px;
        top: 3px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.94);
      }

      &::after {
        content: '';
        position: absolute;
        width: 5px;
        height: 2px;
        left: 8px;
        top: 8px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.94);
        transform-origin: left center;
        transform: rotate(35deg);
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
  border-radius: 20px;
  border: 1px solid rgba(104, 150, 255, 0.14);
  background: linear-gradient(180deg, rgba(5, 16, 41, 0.92) 0%, rgba(3, 11, 31, 0.96) 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

const ResultLabel = styled.div`
  font-size: 14px;
  color: var(--monitor-text-secondary);
`;

const ResultValue = styled.div`
  font-size: 28px;
  font-weight: 900;
  line-height: 1.2;
  color: var(--monitor-green);
`;

const ResultMeta = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--monitor-white);
`;

const BottomMetaRow = styled.div`
  display: flex; /* 가로 배치 */
  gap: 12px;

  /* 각 카드가 반반(1:1) 비율로 공간을 차지하도록 설정 */
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
  flex-direction: column;
  justify-content: center; /* 세로 중앙 정렬 */
  gap: 6px;
  padding: 8px 24px; /* 위아래 패딩을 없애고 높이로 제어 */
  height: 126px; /* 💡 여기서 원하시는 박스 높이로 조절하세요 (예: 60px, 80px 등) */
  border-radius: 18px;
  background: rgba(70, 98, 181, 0.34);
  border: 1px solid rgba(147, 176, 243, 0.12);
`;

const MetaLabel = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #c7ecee;
`;

const MetaValue = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: var(--monitor-white);
`;

export default function MainScanningPanel({ info, elapsedLabel }: MainScanningPanelProps) {
  // 컴포넌트 JSX는 동일하게 유지
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
                  <InfoIcon $variant="folder" /> 설비명: {info.equipmentName}
                </ScanInfoRow>
                <ScanInfoRow>
                  <InfoIcon $variant="list" /> 점검항목: {info.completedStep}/{info.totalSteps} 완료
                </ScanInfoRow>
                <ScanInfoRow>
                  <InfoIcon $variant="clock" /> 경과시간: {elapsedLabel}
                </ScanInfoRow>
              </ScanInfoList>
            </ScanTitleGroup>

            <ResultCard>
              <ResultLabel>VLM 분석결과</ResultLabel>
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