'use client';

import styled from 'styled-components';
import { formatMinutes, getDowntimeToneLabel } from '../model/helpers';
import { DowntimeStat } from '../model/types';

interface DowntimeStatsPanelProps {
  items: DowntimeStat[];
  maxDowntime: number;
  topDowntimeName: string;
  averageAvailability: string;
}

const DowntimeStatsPanel = ({ items, maxDowntime, topDowntimeName, averageAvailability }: DowntimeStatsPanelProps) => {
  return (
    <Panel>
      <Header>
        <TitleGroup>
          <Title>설비별 다운타임 통계</Title>
        </TitleGroup>
        <Badge $tone="amber">집중 관리 {topDowntimeName}</Badge>
      </Header>

      <List>
        {items.map((item) => (
          <Row key={item.id}>
            <LabelWrap>
              <Label>{item.name}</Label>
              <ToneText>{getDowntimeToneLabel(item.tone)}</ToneText>
            </LabelWrap>

            <BarTrack>
              <BarFill $width={(item.downtimeMinutes / maxDowntime) * 100} $tone={item.tone} />
            </BarTrack>

            <Meta>
              <MetaValue>{formatMinutes(item.downtimeMinutes)}</MetaValue>
              <MetaSub>장애 {item.incidents}건</MetaSub>
            </Meta>
          </Row>
        ))}
      </List>

      <Footer>
        <FooterPill $tone="red">가장 긴 중단 {topDowntimeName}</FooterPill>
        <FooterText>평균 가동률 {averageAvailability}%</FooterText>
      </Footer>
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
  margin-bottom: 48px;
`;

const TitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--text-strong);
`;


const Badge = styled.div<{ $tone: 'amber' | 'red' }>`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 10px 24px;
  border-radius: 999px;
  border: 1px solid ${({ $tone }) => ($tone === 'red' ? 'rgba(244, 95, 116, 0.24)' : 'rgba(245, 170, 45, 0.24)')};
  background: ${({ $tone }) => ($tone === 'red' ? 'rgba(244, 95, 116, 0.1)' : 'rgba(245, 170, 45, 0.1)')};
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
`;

const List = styled.div`
  display: grid;
  gap: 16px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
`;

const LabelWrap = styled.div`
  display: grid;
  gap: 4px;
`;

const Label = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #dff9fb;
`;

const ToneText = styled.div`
  font-size: 18px;
  color: #c7ecee;
`;

const BarTrack = styled.div`
  position: relative;
  height: 14px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(121, 145, 198, 0.14);
  border: 1px solid rgba(118, 151, 212, 0.08);
`;

const BarFill = styled.div<{ $width: number; $tone: DowntimeStat['tone'] }>`
  width: ${({ $width }) => `${$width}%`};
  height: 100%;
  border-radius: 999px;
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'critical':
          return 'linear-gradient(90deg, rgba(244, 95, 116, 0.84) 0%, rgba(244, 95, 116, 1) 100%)';
        case 'warning':
          return 'linear-gradient(90deg, rgba(245, 170, 45, 0.84) 0%, rgba(245, 170, 45, 1) 100%)';
        case 'info':
          return 'linear-gradient(90deg, rgba(79, 144, 255, 0.84) 0%, rgba(79, 144, 255, 1) 100%)';
        default:
          return 'linear-gradient(90deg, rgba(79, 144, 255, 0.84) 0%, rgba(79, 144, 255, 1) 100%)';
      }
    }};
  box-shadow:
    ${({ $tone }) => {
      switch ($tone) {
        case 'critical':
          return '0 0 18px rgba(244, 95, 116, 0.34)';
        case 'warning':
          return '0 0 18px rgba(245, 170, 45, 0.34)';
        case 'info':
          return '0 0 18px rgba(79, 144, 255, 0.3)';
        default:
          return 'none';
      }
    }};
`;

const Meta = styled.div`
  display: grid;
  justify-items: end;
  gap: 4px;
`;

const MetaValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #dff9fb;
`;

const MetaSub = styled.div`
  font-size: 20px;
  color: #c7ecee;
`;

const Footer = styled.div`
  margin-top: 18px;
  padding-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid rgba(118, 151, 212, 0.12);
`;

const FooterPill = styled.div<{ $tone: 'red' | 'amber' }>`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 10px 24px;
  border-radius: 999px;
  border: 1px solid ${({ $tone }) => ($tone === 'red' ? 'rgba(244, 95, 116, 0.24)' : 'rgba(245, 170, 45, 0.24)')};
  background: ${({ $tone }) => ($tone === 'red' ? 'rgba(244, 95, 116, 0.1)' : 'rgba(245, 170, 45, 0.1)')};
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
`;

const FooterText = styled.div`
  font-size: 20px;
  color: #dff9fb;
`;

export default DowntimeStatsPanel;
