import styled from 'styled-components';
import type { QuickMetric } from '../model/types';

interface OutputSummaryStripProps {
  metrics: QuickMetric[];
  updateTime: string;
}

const Panel = styled.section`
  min-height: 0;
  border: 1px solid #b8c2ce;
  border-radius: 10px;
  background: var(--panel-bg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  padding: 8px;
`;

const StatCard = styled.div`
  min-height: 88px;
  display: grid;
  place-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid rgba(74, 114, 162, 0.55);
  background: var(--dark-card);
  box-shadow:
    inset 0 0 0 1px rgba(11, 35, 61, 0.72),
    inset 0 0 36px rgba(32, 90, 174, 0.08);

  &:not(:first-child) {
    margin-left: 8px;
  }
`;

const Label = styled.div<{ $accent: 'yellow' | 'white' | 'green' | 'orange' }>`
  font-size: 24px;
  font-weight: 700;
  color:
    ${({ $accent }) => {
      switch ($accent) {
        case 'yellow':
          return 'var(--yellow)';
        case 'green':
          return '#49ff80';
        case 'orange':
          return 'var(--orange)';
        default:
          return '#57b7ff';
      }
    }};
`;

const Value = styled.div<{ $accent: 'yellow' | 'white' | 'green' | 'orange' }>`
  font-size: 42px;
  line-height: 1;
  font-weight: 800;
  color:
    ${({ $accent }) => {
      switch ($accent) {
        case 'yellow':
          return 'var(--yellow)';
        case 'green':
          return '#5bff8d';
        case 'orange':
          return 'var(--orange)';
        default:
          return '#ffffff';
      }
    }};
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
`;

export default function OutputSummaryStrip({ metrics, updateTime }: OutputSummaryStripProps) {
  return (
    <Panel>
      <Grid>
        {metrics.map((metric) => {
          const value = metric.label === 'Update Time' ? updateTime : metric.value;

          return (
            <StatCard key={metric.label}>
              <Label $accent={metric.accent}>{metric.label}</Label>
              <Value $accent={metric.accent} suppressHydrationWarning>{value}</Value>
            </StatCard>
          );
        })}
      </Grid>
    </Panel>
  );
}
