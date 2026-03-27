import styled from 'styled-components';
import type { KpiMetric, SummaryMetric } from '../model/types';

interface AchievementPanelProps {
  summaryMetrics: SummaryMetric[];
  kpiMetrics: KpiMetric[];
}

const Panel = styled.section`
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
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
`;

const HeadTitle = styled.div`
  font-size: 15px;
  font-weight: 800;
  color: #2b384b;
`;

const HeadMeta = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #7c899d;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 1.22fr 1fr;
  gap: 12px;
  padding: 10px;
  min-height: 0;
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

const SummaryCard = styled(DarkCard)`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  overflow: hidden;
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

const KpiCard = styled(DarkCard)`
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 12px 14px 10px;
  gap: 10px;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
`;

const KpiItemCard = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
  min-height: 96px;
  padding: 12px 12px 10px;
  border-radius: 8px;
  border: 1px solid rgba(61, 96, 141, 0.46);
  background: linear-gradient(180deg, rgba(5, 12, 22, 0.92) 0%, rgba(3, 8, 15, 0.96) 100%);
`;

const KpiLabel = styled.div<{ $accent: 'blue' | 'cyan' | 'green' }>`
  font-size: 13px;
  font-weight: 900;
  color: ${({ $accent }) => ($accent === 'green' ? '#4dff85' : $accent === 'cyan' ? '#61c5ff' : '#4ab3ff')};
`;

const KpiValue = styled.div`
  align-self: end;
  font-size: 20px;
  font-weight: 900;
  color: #ffffff;
`;

const KpiFootnote = styled.div`
  font-size: 11px;
  line-height: 1.5;
  color: #7f96b6;
  font-weight: 700;
`;

export default function AchievementPanel({ summaryMetrics, kpiMetrics }: AchievementPanelProps) {
  return (
    <Panel>
      <Head>
        <HeadTitle>실적 / 달성율</HeadTitle>
        <HeadMeta>추가 KPI 포함</HeadMeta>
      </Head>

      <Body>
        <SummaryCard>
          {summaryMetrics.map((metric) => (
            <SummaryRow key={metric.label}>
              <SummaryLabel $accent={metric.accent}>{metric.label}</SummaryLabel>
              <SummaryValue>{metric.value}</SummaryValue>
            </SummaryRow>
          ))}
        </SummaryCard>

        <KpiCard>
          <KpiGrid>
            {kpiMetrics.map((metric) => (
              <KpiItemCard key={metric.label}>
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
