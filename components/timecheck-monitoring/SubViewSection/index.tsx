'use client';

import styled from 'styled-components';
import {
  DefectPredictionCardData,
  FireSafetyCardData,
  MaterialInboundCardData
} from '../model/types';

interface SubViewSectionProps {
  materialInbound: MaterialInboundCardData;
  fireSafety: FireSafetyCardData;
  defectPrediction: DefectPredictionCardData;
}

const Section = styled.section`
  display: grid;
  gap: 10px;
`;

const SectionBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 0 18px;
  border-radius: 0;
  background: rgba(110, 114, 128, 0.34);
  color: var(--monitor-white);
  font-size: 14px;
  font-weight: 900;
`;

const SectionIcon = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.92);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.92);
  }
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 8px; /* 14px -> 8px 축소 */
  height: 160px; /* 100~110px 정도로 제한 (콘텐츠 보호) */
  padding: 16px 24px; /* 18px -> 12px 14px 축소 */
  border-radius: 16px; /* 높이에 맞춰 모서리 곡률 살짝 조정 */
  border: 1px solid rgba(123, 151, 210, 0.18);
  background: linear-gradient(180deg, rgba(21, 33, 58, 0.96) 0%, rgba(16, 28, 51, 0.96) 100%);
  box-shadow:
    0 18px 42px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  overflow: hidden; /* 영역 밖으로 나가는 콘텐츠 숨김 */
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const CardTitle = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 24px; /* 16px -> 14px 축소 */
  font-weight: 900;
  color: var(--monitor-white);
`;

const CardTitleIcon = styled.span<{ $tone: 'blue' | 'green' | 'amber' }>`
  width: 14px; /* 18px -> 14px 축소 */
  height: 14px;
  border-radius: 4px;
  background: ${({ $tone }) => ($tone === 'green' ? 'var(--monitor-green)' : $tone === 'amber' ? 'var(--monitor-amber)' : 'var(--monitor-blue)')};
  box-shadow: ${({ $tone }) => ($tone === 'green' ? '0 0 18px rgba(47, 220, 150, 0.42)' : $tone === 'amber' ? '0 0 18px rgba(255, 197, 66, 0.42)' : '0 0 18px rgba(98, 163, 255, 0.38)')};
`;

const StatusPill = styled.div<{ $tone: 'green' | 'amber' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 24px; /* 30px -> 24px 축소 */
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid ${({ $tone }) => ($tone === 'green' ? 'rgba(47, 220, 150, 0.24)' : 'rgba(255, 197, 66, 0.24)')};
  background: ${({ $tone }) => ($tone === 'green' ? 'rgba(47, 220, 150, 0.1)' : 'rgba(255, 197, 66, 0.1)')};
  font-size: 14px; /* 13px -> 11px 축소 */
  font-weight: 600;
  color: ${({ $tone }) => ($tone === 'green' ? 'var(--monitor-green)' : 'var(--monitor-amber)')};
`;

const StatusDot = styled.span<{ $tone: 'green' | 'amber' }>`
  width: 6px; /* 10px -> 6px 축소 */
  height: 6px;
  border-radius: 999px;
  background: ${({ $tone }) => ($tone === 'green' ? 'var(--monitor-green)' : 'var(--monitor-amber)')};
  box-shadow: ${({ $tone }) => ($tone === 'green' ? '0 0 12px rgba(47, 220, 150, 0.5)' : '0 0 12px rgba(255, 197, 66, 0.5)')};
`;

const InboundBody = styled.div`
  display: flex;
  align-items: baseline; /* 세로 배열에서 가로 또는 타이트하게 변경 */
  gap: 8px;
`;

const LargeText = styled.div`
  font-size: 20px; /* 34px -> 20px 대폭 축소 */
  font-weight: 900;
  letter-spacing: -0.05em;
  color: #7cb3ff;
`;

const MediumText = styled.div`
  font-size: 28px; /* 18px -> 14px 축소 */
  font-weight: 800;
  color: var(--monitor-white);
`;

const SmallText = styled.div`
  font-size: 20px; /* 14px -> 12px 축소 */
  color: var(--monitor-text-secondary);
`;

const ProgressTrack = styled.div`
  position: relative;
  height: 6px; /* 8px -> 6px 축소 */
  overflow: hidden;
  border-radius: 999px;
  background: rgba(120, 149, 202, 0.18);
`;

const ProgressFill = styled.div<{ $value: number }>`
  width: ${({ $value }) => `${$value}%`};
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(98, 163, 255, 0.9) 0%, rgba(125, 192, 255, 1) 100%);
  box-shadow: 0 0 18px rgba(98, 163, 255, 0.34);
`;

const CenterState = styled.div`
  display: flex;
  align-items: center; /* 세로 정렬에서 가로 정렬로 변경하여 공간 절약 */
  gap: 10px;
`;

const CircleIcon = styled.div`
  width: 32px; /* 52px -> 32px 축소 */
  height: 32px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(21, 202, 149, 0.16);
  border: 1px solid rgba(47, 220, 150, 0.24);
  color: var(--monitor-green);
  font-size: 16px; /* 28px -> 16px 축소 */
  font-weight: 900;
  box-shadow: 0 0 24px rgba(47, 220, 150, 0.18);
`;

const PredictionBox = styled.div`
  display: flex;
  align-items: baseline; /* 공간 절약을 위해 세로 정렬에서 가로 정렬로 변경 */
  justify-content: space-between;
  gap: 8px;
  border-radius: 12px;
  border: 1px solid rgba(255, 106, 122, 0.28);
  background:
    radial-gradient(circle at 0% 0%, rgba(255, 106, 122, 0.18) 0%, rgba(255, 106, 122, 0) 30%),
    linear-gradient(180deg, rgba(93, 9, 22, 0.95) 0%, rgba(82, 8, 18, 0.98) 100%);
  padding: 10px 14px; /* 22px 18px -> 10px 14px 대폭 축소 */
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  margin-top: 6px;
`;

const PredictionLabel = styled.div`
  font-size: 16px; /* 15px -> 12px 축소 */
  color: rgba(255, 235, 239, 0.86);
  display: none; /* 100px 안에 다 넣기 위해 라벨 생략 (필요시 복구) */
`;

const PredictionTitle = styled.div`
  font-size: 18px; /* 30px -> 18px 축소 */
  font-weight: 900;
  letter-spacing: -0.04em;
  color: #fff6f7;
`;

const PredictionMeta = styled.div`
  font-size: 16px; /* 16px -> 12px 축소 */
  font-weight: 700;
  color: rgba(255, 227, 232, 0.84);
`;

export default function SubViewSection({
  materialInbound,
  fireSafety,
  defectPrediction
}: SubViewSectionProps) {
  return (
    <Section>
      <CardsGrid>
        <Card>
          <CardTop>
            <CardTitle>
              <CardTitleIcon $tone="blue" /> 자재입고
            </CardTitle>
            <StatusPill $tone="green">
              <StatusDot $tone="green" /> Live
            </StatusPill>
          </CardTop>

          <InboundBody>
            <LargeText>OCR 인식 중</LargeText>
            <SmallText>{materialInbound.documentId}</SmallText>
          </InboundBody>

          <ProgressTrack>
            <ProgressFill $value={materialInbound.progress} />
          </ProgressTrack>
        </Card>

        <Card>
          <CardTop>
            <CardTitle>
              <CardTitleIcon $tone="green" /> 소방관리
            </CardTitle>
            <StatusPill $tone="green">
              <StatusDot $tone="green" /> Live
            </StatusPill>
          </CardTop>

          <CenterState>
            <CircleIcon>✓</CircleIcon>
            <MediumText>{fireSafety.zone}</MediumText>
            <SmallText>{fireSafety.description}</SmallText>
          </CenterState>
        </Card>

        <Card>
          <CardTop>
            <CardTitle>
              <CardTitleIcon $tone="amber" /> 불량예측
            </CardTitle>
            <StatusPill $tone="amber">
              <StatusDot $tone="amber" /> Analysing
            </StatusPill>
          </CardTop>

          <PredictionBox>
            <PredictionLabel>{defectPrediction.label}</PredictionLabel>
            <PredictionTitle>{defectPrediction.title}</PredictionTitle>
            <PredictionMeta>신뢰도 {defectPrediction.confidence}%</PredictionMeta>
          </PredictionBox>
        </Card>
      </CardsGrid>
    </Section>
  );
}
