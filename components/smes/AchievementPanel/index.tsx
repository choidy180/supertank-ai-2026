import styled from 'styled-components';
import type { KpiMetric, SummaryMetric } from '../model/types';

// 💡 팁: 막대그래프를 그리기 위해 데이터 모델에 percent(백분율) 필드가 있다고 가정했습니다.
// 실제 프로젝트의 types 파일에서 해당 필드를 추가하거나, 컴포넌트 내에서 별도로 계산해서 넣어주세요.
interface ExtendedSummaryMetric extends SummaryMetric {
  percent?: number; 
}

interface AchievementPanelProps {
  summaryMetrics: ExtendedSummaryMetric[];
  kpiMetrics: KpiMetric[];
}

const Panel = styled.section`
  /* 💡 여기서 높이를 제어하세요! */
  height: 240px; 
  min-height: 0;
  
  display: flex;
  flex-direction: column; /* 세로 배치 */
  border: 1px solid #b8c2ce;
  border-radius: 10px;
  background: var(--panel-bg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 34px;
  padding: 0 14px;
  background: var(--panel-head-bg);
  border-bottom: 1px solid #c6ced8;
  flex-shrink: 0;
`;

const HeadTitle = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #2b384b;
`;

const HeadMeta = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #585f69;
`;

const Body = styled.div`
  flex: 1; 
  display: flex;
  gap: 16px; /* 카드 사이 간격을 조금 넓혔습니다 */
  padding: 10px;
  min-height: 0;

  /* 💡 3개의 카드의 비율을 1 : 1.5 : 1.2 로 나눔 (중앙을 넓게) */
  > :nth-child(1) {
    flex: 1;
  }
  > :nth-child(2) {
    flex: 1.5; /* 새롭게 추가된 중앙 막대그래프 영역 */
  }
  > :nth-child(3) {
    flex: 1.2;
  }
`;

const DarkCard = styled.div`
  min-height: 0;
  border-radius: 10px;
  border: 1px solid rgba(74, 114, 162, 0.55);
  background: var(--dark-card);
  box-shadow:
    inset 0 0 0 1px rgba(11, 35, 61, 0.72),
    inset 0 0 36px rgba(32, 90, 174, 0.08);
`;

/* =========================================
   1. 좌측 Summary 카드
========================================= */
const SummaryCard = styled(DarkCard)`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  > * {
    flex: 1;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 18px;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(82, 122, 172, 0.36);
  }
`;

const SummaryLabel = styled.div<{ $accent: 'yellow' | 'green' | 'blue' }>`
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: ${({ $accent }) => ($accent === 'yellow' ? 'var(--yellow)' : $accent === 'green' ? '#44ff8a' : '#3da1ff')};
`;

const SummaryValue = styled.div`
  font-size: 28px;
  font-weight: 900;
  color: #ffffff;
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
`;

/* =========================================
   2. 중앙 Chart 카드 (새로 추가됨)
========================================= */
const ChartCard = styled(DarkCard)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 16px 20px;
  gap: 16px;
`;

const BarRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const BarLabel = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #c6ced8;
`;

const BarValue = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #ffffff;
`;

const BarTrack = styled.div`
  width: 100%;
  height: 14px;
  background: rgba(255, 255, 255, 0.1); /* 트랙(배경) 색상 */
  border-radius: 8px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $percent: number; $accent: 'yellow' | 'green' | 'blue' }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%; /* 길이를 퍼센트로 조절 */
  border-radius: 8px;
  transition: width 0.5s ease-out; /* 부드러운 애니메이션 효과 */
  background: ${({ $accent }) => 
    $accent === 'yellow' ? 'var(--yellow)' : 
    $accent === 'green' ? '#44ff8a' : '#3da1ff'};
`;

/* =========================================
   3. 우측 KPI 카드
========================================= */
const KpiCard = styled(DarkCard)`
  display: flex;
  flex-direction: column;
  padding: 12px 14px 10px;
  gap: 10px;
`;

const KpiGrid = styled.div`
  display: flex;
  flex: 1; 
  gap: 10px;

  > * {
    flex: 1;
    min-width: 0;
  }
`;

const KpiItemCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
  gap: 12px;
  min-height: 96px;
  padding: 12px 12px 10px;
  border-radius: 8px;
  border: 1px solid rgba(61, 96, 141, 0.46);
  background: linear-gradient(180deg, rgba(5, 12, 22, 0.92) 0%, rgba(3, 8, 15, 0.96) 100%);
`;

const KpiLabel = styled.div<{ $accent: 'blue' | 'cyan' | 'green' }>`
  font-size: 20px;
  font-weight: 700;
  color: ${({ $accent }) => ($accent === 'green' ? '#4dff85' : $accent === 'cyan' ? '#61c5ff' : '#4ab3ff')};
`;

const KpiValue = styled.div`
  align-self: flex-end;
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
`;

const KpiFootnote = styled.div`
  font-size: 16px;
  line-height: 1.5;
  color: #ffffff;
  font-weight: 700;
  flex-shrink: 0; 
`;

/* =========================================
   메인 컴포넌트
========================================= */
export default function AchievementPanel({ summaryMetrics, kpiMetrics }: AchievementPanelProps) {
  return (
    <Panel>
      <Head>
        <HeadTitle>실적 / 달성율</HeadTitle>
        <HeadMeta>추가 KPI 포함</HeadMeta>
      </Head>

      <Body>
        {/* 1. 좌측 요약 카드 */}
        <SummaryCard>
          {summaryMetrics.map((metric) => (
            <SummaryRow key={`summary-${metric.label}`}>
              <SummaryLabel $accent={metric.accent}>{metric.label}</SummaryLabel>
              <SummaryValue>{metric.value}</SummaryValue>
            </SummaryRow>
          ))}
        </SummaryCard>

        {/* 2. 중앙 막대그래프 카드 (신규 추가) */}
        <ChartCard>
          {summaryMetrics.map((metric) => {
            // 임시로 퍼센트가 없을 경우 0으로 처리. 실제 데이터 연동 필요.
            const percent = metric.percent ?? 0; 
            return (
              <BarRow key={`chart-${metric.label}`}>
                <BarHeader>
                  <BarLabel>{metric.label} 달성률</BarLabel>
                  <BarValue>{percent}%</BarValue>
                </BarHeader>
                <BarTrack>
                  <BarFill $percent={percent} $accent={metric.accent} />
                </BarTrack>
              </BarRow>
            );
          })}
        </ChartCard>

        {/* 3. 우측 KPI 카드 */}
        <KpiCard>
          <KpiGrid>
            {kpiMetrics.map((metric) => (
              <KpiItemCard key={`kpi-${metric.label}`}>
                <KpiLabel $accent={metric.accent}>{metric.label}</KpiLabel>
                <KpiValue>{metric.value}</KpiValue>
              </KpiItemCard>
            ))}
          </KpiGrid>

          <KpiFootnote>
            조회 기간과 비가동 이력 기준으로 달성률, 시간 가동률, 양품률을 자동 계산하도록 구성했습니다.
          </KpiFootnote>
        </KpiCard>
      </Body>
    </Panel>
  );
}