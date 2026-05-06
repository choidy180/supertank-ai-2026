'use client';

import styled from 'styled-components';

import type {
  DefectPredictionCardData,
  FireSafetyCardData,
  MaterialInboundCardData,
} from '../model/types';

interface SubViewSectionProps {
  materialInbound: MaterialInboundCardData;
  fireSafety: FireSafetyCardData;
  defectPrediction: DefectPredictionCardData;
}

type AccentTone = 'blue' | 'green' | 'amber' | 'red';

type ToneVars = {
  color: string;
  border: string;
  background: string;
};

const ACCENT_TONE_VARS: Record<AccentTone, ToneVars> = {
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

export default function SubViewSection({
  materialInbound,
  fireSafety,
  defectPrediction,
}: SubViewSectionProps) {
  return (
    <Section>
      <CardsGrid>
        <Card>
          <CardTop>
            <CardTitle>
              <CardTitleIcon $tone="blue" />
              자재입고
            </CardTitle>

            <StatusPill $tone="green">
              <StatusDot $tone="green" />
              Live
            </StatusPill>
          </CardTop>

          <InboundBody>
            <LargeText $tone="blue">OCR 인식 중</LargeText>
            <SmallText>{materialInbound.documentId}</SmallText>
          </InboundBody>

          <ProgressTrack>
            <ProgressFill $value={materialInbound.progress} $tone="blue" />
          </ProgressTrack>
        </Card>

        <Card>
          <CardTop>
            <CardTitle>
              <CardTitleIcon $tone="green" />
              소방관리
            </CardTitle>

            <StatusPill $tone="green">
              <StatusDot $tone="green" />
              Live
            </StatusPill>
          </CardTop>

          <CenterState>
            <CircleIcon>✓</CircleIcon>

            <StateTextGroup>
              <MediumText>{fireSafety.zone}</MediumText>
              <SmallText>{fireSafety.description}</SmallText>
            </StateTextGroup>
          </CenterState>
        </Card>

        <Card>
          <CardTop>
            <CardTitle>
              <CardTitleIcon $tone="amber" />
              불량예측
            </CardTitle>

            <StatusPill $tone="amber">
              <StatusDot $tone="amber" />
              Analysing
            </StatusPill>
          </CardTop>

          <PredictionBox>
            <PredictionTextGroup>
              <PredictionLabel>{defectPrediction.label}</PredictionLabel>
              <PredictionTitle>{defectPrediction.title}</PredictionTitle>
            </PredictionTextGroup>

            <PredictionMeta>
              신뢰도 {defectPrediction.confidence}%
            </PredictionMeta>
          </PredictionBox>
        </Card>
      </CardsGrid>
    </Section>
  );
}

const Section = styled.section`
  display: grid;
  gap: 10px;
  min-width: 0;
  color: var(--color-text-primary);
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  min-width: 0;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 10px;
  min-height: 160px;
  padding: 16px 20px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition:
    border-color 160ms ease,
    background 160ms ease,
    transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--color-border-strong);
    background: var(--color-surface-muted);
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
`;

const CardTitle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: var(--color-text-primary);
  font-size: 22px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.03em;
  word-break: keep-all;
`;

const CardTitleIcon = styled.span<{ $tone: AccentTone }>`
  width: 12px;
  height: 12px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: ${({ $tone }) => ACCENT_TONE_VARS[$tone].color};
`;

const StatusPill = styled.div<{ $tone: 'green' | 'amber' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  padding: 0 10px;
  border: 1px solid ${({ $tone }) => ACCENT_TONE_VARS[$tone].border};
  border-radius: 999px;
  background: ${({ $tone }) => ACCENT_TONE_VARS[$tone].background};
  color: ${({ $tone }) => ACCENT_TONE_VARS[$tone].color};
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
`;

const StatusDot = styled.span<{ $tone: 'green' | 'amber' }>`
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: ${({ $tone }) => ACCENT_TONE_VARS[$tone].color};
`;

const InboundBody = styled.div`
  display: grid;
  align-content: center;
  gap: 6px;
  min-width: 0;
`;

const LargeText = styled.div<{ $tone: AccentTone }>`
  color: ${({ $tone }) => ACCENT_TONE_VARS[$tone].color};
  font-size: 22px;
  font-weight: 900;
  line-height: 1.25;
  letter-spacing: -0.04em;
  word-break: keep-all;
`;

const MediumText = styled.div`
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.03em;
  word-break: keep-all;
`;

const SmallText = styled.div`
  min-width: 0;
  overflow: hidden;
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.45;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProgressTrack = styled.div`
  position: relative;
  height: 7px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-muted);
`;

const ProgressFill = styled.div<{ $value: number; $tone: AccentTone }>`
  width: ${({ $value }) => `${Math.min(Math.max($value, 0), 100)}%`};
  height: 100%;
  border-radius: 999px;
  background: ${({ $tone }) => ACCENT_TONE_VARS[$tone].color};
  transition: width 420ms ease;
`;

const CenterState = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const CircleIcon = styled.div`
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  border: 1px solid var(--color-success);
  border-radius: 999px;
  background: var(--color-success-soft);
  color: var(--color-success);
  font-size: 17px;
  font-weight: 900;
`;

const StateTextGroup = styled.div`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

const PredictionBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;
  padding: 12px 14px;
  border: 1px solid var(--color-error);
  border-radius: 14px;
  background: var(--color-error-soft);
  color: var(--color-error);
`;

const PredictionTextGroup = styled.div`
  display: grid;
  gap: 3px;
  min-width: 0;
`;

const PredictionLabel = styled.div`
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
`;

const PredictionTitle = styled.div`
  min-width: 0;
  overflow: hidden;
  color: var(--color-error);
  font-size: 18px;
  font-weight: 900;
  line-height: 1.3;
  letter-spacing: -0.04em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PredictionMeta = styled.div`
  flex: 0 0 auto;
  color: var(--color-error);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.35;
  white-space: nowrap;
`;