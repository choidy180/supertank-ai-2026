'use client';

import styled from 'styled-components';
import { DailyProgress } from '../model/types';

interface DailyCompletionPanelProps {
  progress: DailyProgress;
}

const Panel = styled.section`
  min-height: 0;
  display: grid;
  align-content: start;
  gap: 18px;
  padding: 18px 20px 16px;
  border-radius: 22px;
  border: 1px solid rgba(112, 146, 220, 0.16);
  background:
    linear-gradient(180deg, rgba(8, 20, 46, 0.96) 0%, rgba(5, 14, 31, 0.96) 100%);
  box-shadow:
    0 18px 52px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Icon = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: conic-gradient(var(--monitor-blue) 0 78%, rgba(98, 163, 255, 0.12) 78% 100%);
  box-shadow: 0 0 16px rgba(98, 163, 255, 0.2);
`;

const Title = styled.h3`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--monitor-white);
`;

const Center = styled.div`
  display: grid;
  justify-items: center;
  gap: 10px;
  padding-top: 6px;
`;

const Percentage = styled.div`
  font-size: 66px;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.06em;
  color: #9cc0ff;
  text-shadow: 0 0 24px rgba(98, 163, 255, 0.18);
`;

const Meta = styled.div`
  font-size: 26px;
  margin-top: 8px;
  font-weight: 700;
  color: var(--monitor-text-secondary);
`;

const Track = styled.div`
  position: relative;
  height: 14px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(113, 148, 220, 0.14);
  border: 1px solid rgba(112, 146, 220, 0.1);
`;

const Fill = styled.div<{ $percent: number }>`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(57, 118, 238, 0.9) 0%, rgba(99, 164, 255, 1) 100%);
  box-shadow: 0 0 18px rgba(98, 163, 255, 0.34);
`;

export default function DailyCompletionPanel({ progress }: DailyCompletionPanelProps) {
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

      <Track>
        <Fill $percent={progress.percent} />
      </Track>
    </Panel>
  );
}
