'use client';

import styled from 'styled-components';

import { DailyProgress } from '../model/types';

interface DailyCompletionPanelProps {
  progress: DailyProgress;
}

const getSafePercent = (percent: number) => {
  return Math.min(Math.max(percent, 0), 100);
};

export default function DailyCompletionPanel({
  progress,
}: DailyCompletionPanelProps) {
  const safePercent = getSafePercent(progress.percent);

  return (
    <Panel>
      <Header>
        <Icon />
        <Title>금일 순회 점검률</Title>
      </Header>

      <Center>
        <Percentage>{progress.percent}%</Percentage>

        <Meta>
          목표 {progress.target}건 / 완료 {progress.completed}건
        </Meta>
      </Center>

      <Track
        role="progressbar"
        aria-label="금일 순회 점검률"
        aria-valuenow={safePercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <Fill $percent={safePercent} />
      </Track>
    </Panel>
  );
}

const Panel = styled.section`
  display: grid;
  align-content: start;
  gap: 18px;
  min-height: 0;
  padding: 18px 20px 16px;
  border: 1px solid var(--color-border);
  border-radius: 22px;
  background: var(--color-surface);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 18px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const Icon = styled.span`
  position: relative;
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  border: 2px solid var(--color-accent);
  border-radius: 999px;

  &::after {
    position: absolute;
    inset: 4px;
    border-radius: 999px;
    background: var(--color-accent);
    content: '';
  }
`;

const Title = styled.h3`
  margin: 0;
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.02em;
  word-break: keep-all;
`;

const Center = styled.div`
  display: grid;
  justify-items: center;
  gap: 10px;
  padding-top: 6px;
  text-align: center;
`;

const Percentage = styled.div`
  color: var(--color-accent);
  font-size: clamp(52px, 4vw, 66px);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.06em;
`;

const Meta = styled.div`
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 26px;
  font-weight: 700;
  line-height: 1.35;
  word-break: keep-all;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Track = styled.div`
  position: relative;
  height: 14px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-muted);
`;

const Fill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  border-radius: 999px;
  background: var(--color-accent);
  transition: width 420ms ease;
`;