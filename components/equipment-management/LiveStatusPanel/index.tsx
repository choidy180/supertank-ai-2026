'use client';

import styled from 'styled-components';

import { LiveSummary } from '../model/types';

interface LiveStatusPanelProps {
  summary: LiveSummary;
}

type StatusTone = 'red' | 'blue' | 'green';

type ToneVars = {
  color: string;
  border: string;
  background: string;
};

const STATUS_TONE_VARS: Record<StatusTone, ToneVars> = {
  red: {
    color: 'var(--color-error)',
    border: 'var(--color-error)',
    background: 'var(--color-error-soft)',
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

const LiveStatusPanel = ({ summary }: LiveStatusPanelProps) => {
  return (
    <Panel>
      <Header>
        <TitleGroup>
          <Title>실시간 무작업 현황</Title>
        </TitleGroup>

        <Badge>현재 교대 1조</Badge>
      </Header>

      <CardGrid>
        <StatusCard $tone="red">
          <StatusCardTop>
            <StatusDot $tone="red" />
            <Label>발생</Label>
          </StatusCardTop>

          <Value $tone="red">{summary.incident}</Value>
          <Hint>즉시 확인 필요</Hint>
        </StatusCard>

        <StatusCard $tone="blue">
          <StatusCardTop>
            <StatusDot $tone="blue" />
            <Label>조치중</Label>
          </StatusCardTop>

          <Value $tone="blue">{summary.processing}</Value>
          <Hint>현장 조치 진행</Hint>
        </StatusCard>

        <StatusCard $tone="green">
          <StatusCardTop>
            <StatusDot $tone="green" />
            <Label>완료</Label>
          </StatusCardTop>

          <Value $tone="green">{summary.done}</Value>
          <Hint>정상 운영 복귀</Hint>
        </StatusCard>
      </CardGrid>
    </Panel>
  );
};

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 22px;
  border: 1px solid var(--color-border);
  border-radius: 28px;
  background: var(--color-surface);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 22px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;
  margin-bottom: 18px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TitleGroup = styled.div`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

const Title = styled.h2`
  margin: 0;
  color: var(--color-text-primary);
  font-size: clamp(28px, 2.4vw, 36px);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.04em;
  word-break: keep-all;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 18px;
  border: 1px solid var(--color-accent);
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatusCard = styled.div<{ $tone: StatusTone }>`
  display: grid;
  gap: 10px;
  min-width: 0;
  padding: 18px 16px;
  border: 1px solid var(--color-border);
  border-radius: 22px;
  background: var(--color-surface-muted);
  color: var(--color-text-primary);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${({ $tone }) => STATUS_TONE_VARS[$tone].border};
    background: var(--color-surface-hover);
  }
`;

const StatusCardTop = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const StatusDot = styled.span<{ $tone: StatusTone }>`
  width: 10px;
  height: 10px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: ${({ $tone }) => STATUS_TONE_VARS[$tone].color};
`;

const Label = styled.div`
  color: var(--color-text-primary);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  word-break: keep-all;
`;

const Value = styled.div<{ $tone: StatusTone }>`
  color: ${({ $tone }) => STATUS_TONE_VARS[$tone].color};
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.05em;
`;

const Hint = styled.div`
  color: var(--color-text-secondary);
  font-size: 20px;
  line-height: 1.4;
  word-break: keep-all;
`;

export default LiveStatusPanel;