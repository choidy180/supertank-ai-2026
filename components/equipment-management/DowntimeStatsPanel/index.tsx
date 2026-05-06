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

type DowntimeTone = DowntimeStat['tone'];
type BadgeTone = 'amber' | 'red';

type ToneVars = {
  color: string;
  border: string;
  background: string;
};

const DOWNTIME_TONE_VARS: Record<DowntimeTone, ToneVars> = {
  critical: {
    color: 'var(--color-error)',
    border: 'var(--color-error)',
    background: 'var(--color-error-soft)',
  },
  warning: {
    color: 'var(--color-warning)',
    border: 'var(--color-warning)',
    background: 'var(--color-warning-soft)',
  },
  info: {
    color: 'var(--color-accent)',
    border: 'var(--color-accent)',
    background: 'var(--color-accent-soft)',
  },
};

const BADGE_TONE_VARS: Record<BadgeTone, ToneVars> = {
  amber: {
    color: 'var(--color-warning)',
    border: 'var(--color-warning)',
    background: 'var(--color-warning-soft)',
  },
  red: {
    color: 'var(--color-error)',
    border: 'var(--color-error)',
    background: 'var(--color-error-soft)',
  },
};

const DowntimeStatsPanel = ({
  items,
  maxDowntime,
  topDowntimeName,
  averageAvailability,
}: DowntimeStatsPanelProps) => {
  const getBarWidth = (downtimeMinutes: number) => {
    if (maxDowntime <= 0) {
      return 0;
    }

    return Math.min((downtimeMinutes / maxDowntime) * 100, 100);
  };

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
              <ToneText $tone={item.tone}>
                {getDowntimeToneLabel(item.tone)}
              </ToneText>
            </LabelWrap>

            <BarTrack>
              <BarFill
                $width={getBarWidth(item.downtimeMinutes)}
                $tone={item.tone}
              />
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
  margin-bottom: 32px;

  @media (max-width: 768px) {
    flex-direction: column;
    margin-bottom: 24px;
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
  font-size: clamp(30px, 2.5vw, 38px);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.04em;
  word-break: keep-all;
`;

const Badge = styled.div<{ $tone: BadgeTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 18px;
  border: 1px solid ${({ $tone }) => BADGE_TONE_VARS[$tone].border};
  border-radius: 999px;
  background: ${({ $tone }) => BADGE_TONE_VARS[$tone].background};
  color: ${({ $tone }) => BADGE_TONE_VARS[$tone].color};
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
`;

const List = styled.div`
  display: grid;
  gap: 16px;
  min-height: 0;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  min-width: 0;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    align-items: stretch;
  }
`;

const LabelWrap = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

const Label = styled.div`
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.03em;
  word-break: keep-all;
`;

const ToneText = styled.div<{ $tone: DowntimeTone }>`
  color: ${({ $tone }) => DOWNTIME_TONE_VARS[$tone].color};
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
`;

const BarTrack = styled.div`
  position: relative;
  height: 14px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-muted);
`;

const BarFill = styled.div<{ $width: number; $tone: DowntimeTone }>`
  width: ${({ $width }) => `${$width}%`};
  height: 100%;
  border-radius: 999px;
  background: ${({ $tone }) => DOWNTIME_TONE_VARS[$tone].color};
  transition: width 420ms ease;
`;

const Meta = styled.div`
  display: grid;
  justify-items: end;
  gap: 4px;
  min-width: 112px;

  @media (max-width: 768px) {
    justify-items: start;
    min-width: 0;
  }
`;

const MetaValue = styled.div`
  color: var(--color-text-primary);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
  white-space: nowrap;
`;

const MetaSub = styled.div`
  color: var(--color-text-secondary);
  font-size: 20px;
  line-height: 1.35;
  white-space: nowrap;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);

  @media (max-width: 768px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const FooterPill = styled.div<{ $tone: BadgeTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0 18px;
  border: 1px solid ${({ $tone }) => BADGE_TONE_VARS[$tone].border};
  border-radius: 999px;
  background: ${({ $tone }) => BADGE_TONE_VARS[$tone].background};
  color: ${({ $tone }) => BADGE_TONE_VARS[$tone].color};
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
`;

const FooterText = styled.div`
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.35;
`;

export default DowntimeStatsPanel;