'use client';

import styled, { css, keyframes } from 'styled-components';

interface HeaderSectionProps {
  nowLabel: string;
  totalCount: number;
  averageAvailability: string;
}

type MetaTone = 'neutral' | 'blue' | 'green';

type MetaToneVars = {
  color: string;
  border: string;
  background: string;
};

const META_TONE_VARS: Record<MetaTone, MetaToneVars> = {
  neutral: {
    color: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
    background: 'var(--color-surface-muted)',
  },
  blue: {
    color: 'var(--color-accent)',
    border: 'var(--color-accent)',
    background: 'var(--color-accent-soft)',
  },
  green: {
    color: 'var(--color-success)',
    border: 'var(--color-success)',
    background: 'var(--color-success-soft)',
  },
};

const HeaderSection = ({
  nowLabel,
  totalCount,
  averageAvailability,
}: HeaderSectionProps) => {
  return (
    <Wrap>
      <TitleGroup>
        <Eyebrow>
          <PulseDot />
          실시간 운영 보드
        </Eyebrow>

        <Title>설비 관리 대시보드</Title>
      </TitleGroup>

      <MetaGroup>
        <MetaPill $tone="blue">총 이력 {totalCount}건</MetaPill>

        <MetaPill>
          <LiveDot />
          실시간 동기화 {nowLabel}
        </MetaPill>

        <MetaPill $tone="green">평균 가동률 {averageAvailability}%</MetaPill>
      </MetaGroup>
    </Wrap>
  );
};

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }

  70% {
    transform: scale(1.12);
    opacity: 0.68;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const dotBase = css`
  width: 10px;
  height: 10px;
  flex: 0 0 auto;
  border-radius: 999px;
`;

const Wrap = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px;
  border: 1px solid var(--color-border);
  border-radius: 28px;
  background: var(--color-surface);
  color: var(--color-text-primary);

  @media (max-width: 1180px) {
    flex-direction: column;
    align-items: stretch;
  }

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 22px;
  }
`;

const TitleGroup = styled.div`
  display: grid;
  gap: 10px;
  min-width: 0;
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  width: fit-content;
  min-height: 38px;
  padding: 0 14px;
  gap: 10px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-muted);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
`;

const PulseDot = styled.span`
  ${dotBase};

  background: var(--color-accent);
  animation: ${pulse} 2.2s infinite;
`;

const Title = styled.h1`
  margin: 0;
  color: var(--color-text-primary);
  font-size: clamp(20px, 2.2vw, 24px);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.05em;
`;

const MetaGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  min-width: 0;

  @media (max-width: 1180px) {
    justify-content: flex-start;
  }
`;

const MetaPill = styled.div<{ $tone?: MetaTone }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid ${({ $tone = 'neutral' }) => META_TONE_VARS[$tone].border};
  border-radius: 999px;
  background: ${({ $tone = 'neutral' }) => META_TONE_VARS[$tone].background};
  color: ${({ $tone = 'neutral' }) => META_TONE_VARS[$tone].color};
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
`;

const LiveDot = styled.span`
  ${dotBase};

  background: var(--color-success);
`;

export default HeaderSection;