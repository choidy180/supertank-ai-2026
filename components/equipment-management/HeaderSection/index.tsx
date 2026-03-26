'use client';

import styled, { css, keyframes } from 'styled-components';

interface HeaderSectionProps {
  nowLabel: string;
  totalCount: number;
  averageAvailability: string;
}

const HeaderSection = ({ nowLabel, totalCount, averageAvailability }: HeaderSectionProps) => {
  return (
    <Wrap>
      <TitleGroup>
        <Eyebrow>
          <PulseDot /> 실시간 운영 보드
        </Eyebrow>
        <Title>설비 관리 대시보드</Title>
      </TitleGroup>

      <MetaGroup>
        <MetaPill $tone="blue">총 이력 {totalCount}건</MetaPill>
        <MetaPill>
          <LiveDot /> 실시간 동기화 {nowLabel}
        </MetaPill>
        <MetaPill $tone="green">평균 가동률 {averageAvailability}%</MetaPill>
      </MetaGroup>
    </Wrap>
  );
};

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(79, 144, 255, 0.24);
  }
  70% {
    transform: scale(1.06);
    box-shadow: 0 0 0 12px rgba(79, 144, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(79, 144, 255, 0);
  }
`;

const Wrap = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px;
  border-radius: 28px;
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, rgba(10, 23, 47, 0.92) 0%, rgba(6, 15, 31, 0.92) 100%);
  box-shadow:
    var(--shadow-panel),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);

  @media (max-width: 1180px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TitleGroup = styled.div`
  display: grid;
  gap: 10px;
  min-width: 0;
`;

const Eyebrow = styled.div`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(118, 151, 212, 0.18);
  background: rgba(14, 28, 57, 0.86);
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 600;
`;

const dotBase = css`
  width: 10px;
  height: 10px;
  border-radius: 999px;
`;

const PulseDot = styled.span`
  ${dotBase};
  background: var(--blue);
  animation: ${pulse} 2.2s infinite;
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(30px, 2.2vw, 40px);
  font-weight: 800;
  letter-spacing: -0.05em;
  color: var(--text-strong);
`;

const Description = styled.p`
  margin: 0;
  max-width: 760px;
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-secondary);
`;

const MetaGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

const MetaPill = styled.div<{ $tone?: 'neutral' | 'blue' | 'green' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone = 'neutral' }) => {
      switch ($tone) {
        case 'blue':
          return 'rgba(79, 144, 255, 0.28)';
        case 'green':
          return 'rgba(39, 209, 126, 0.26)';
        default:
          return 'rgba(118, 151, 212, 0.18)';
      }
    }};
  background:
    ${({ $tone = 'neutral' }) => {
      switch ($tone) {
        case 'blue':
          return 'rgba(79, 144, 255, 0.12)';
        case 'green':
          return 'rgba(39, 209, 126, 0.12)';
        default:
          return 'rgba(15, 30, 59, 0.82)';
      }
    }};
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
`;

const LiveDot = styled.span`
  ${dotBase};
  background: var(--green);
  box-shadow: 0 0 16px rgba(39, 209, 126, 0.76);
`;

export default HeaderSection;
