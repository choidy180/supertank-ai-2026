'use client';

import styled from 'styled-components';
import { LiveSummary } from '../model/types';

interface LiveStatusPanelProps {
  summary: LiveSummary;
}

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
          <Label>발생</Label>
          <Value $tone="red">{summary.incident}</Value>
          <Hint>즉시 확인 필요</Hint>
        </StatusCard>

        <StatusCard $tone="blue">
          <Label>조치중</Label>
          <Value $tone="blue">{summary.processing}</Value>
          <Hint>현장 조치 진행</Hint>
        </StatusCard>

        <StatusCard $tone="green">
          <Label>완료</Label>
          <Value $tone="green">{summary.done}</Value>
          <Hint>정상 운영 복귀</Hint>
        </StatusCard>
      </CardGrid>
    </Panel>
  );
};

const Panel = styled.section`
  min-height: 0;
  padding: 22px;
  border-radius: 28px;
  border: 1px solid var(--line-soft);
  background: linear-gradient(180deg, rgba(9, 21, 43, 0.95) 0%, rgba(7, 16, 34, 0.95) 100%);
  box-shadow:
    var(--shadow-panel),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
`;

const TitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--text-strong);
`;

const Caption = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.72;
  color: var(--text-secondary);
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid rgba(79, 144, 255, 0.24);
  background: rgba(79, 144, 255, 0.1);
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

const StatusCard = styled.div<{ $tone: 'red' | 'blue' | 'green' }>`
  position: relative;
  display: grid;
  gap: 10px;
  padding: 18px 16px;
  border-radius: 22px;
  border: 1px solid rgba(118, 151, 212, 0.14);
  background: rgba(15, 31, 60, 0.82);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
  }
`;

const Label = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #dff9fb;
`;

const Value = styled.div<{ $tone: 'red' | 'blue' | 'green' }>`
  font-size: 42px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.05em;
  color:
    ${({ $tone }) => {
      switch ($tone) {
        case 'red':
          return 'var(--red)';
        case 'blue':
          return 'var(--blue)';
        case 'green':
          return 'var(--green)';
        default:
          return 'var(--text-strong)';
      }
    }};
`;

const Hint = styled.div`
  font-size: 20px;
  color: #c7ecee;
`;

export default LiveStatusPanel;
