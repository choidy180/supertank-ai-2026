import styled from 'styled-components';
import type { RepairTimeStat } from '../model/types';
import { formatHourValue } from '../model/helpers';

interface BarChartProps {
  items: RepairTimeStat[];
  maxHour: number;
}

const ChartFrame = styled.div`
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 10px;
  min-height: 236px;
`;

const AxisColumn = styled.div`
  position: relative;
  display: grid;
  align-content: stretch;
  min-height: 0;
  padding-top: 16px;
  padding-bottom: 28px;
`;

const TickList = styled.div`
  position: absolute;
  inset: 16px 0 28px;
`;

const TickLabel = styled.div<{ $bottom: number }>`
  position: absolute;
  left: 0;
  bottom: ${({ $bottom }) => `${$bottom}%`};
  transform: translateY(50%);
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
`;

const PlotArea = styled.div`
  position: relative;
  min-height: 0;
  padding-top: 16px;
  padding-bottom: 28px;
`;

const GridLine = styled.div<{ $bottom: number }>`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${({ $bottom }) => `${$bottom}%`};
  height: 1px;
  background: rgba(181, 189, 198, 0.32);
`;

const BarList = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  align-items: end;
  gap: 20px;

  @media (max-width: 880px) {
    gap: 14px;
  }
`;

const BarGroup = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 8px;
  justify-items: center;
`;

const BarValue = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: var(--text-secondary);
`;

const BarTrack = styled.div`
  width: 100%;
  max-width: 42px;
  height: 100%;
  display: flex;
  align-items: end;
  justify-content: center;
`;

const Bar = styled.div<{ $height: number; $tone: 'primary' | 'muted' }>`
  width: 100%;
  height: ${({ $height }) => `${$height}%`};
  min-height: 8px;
  border-radius: 12px 12px 0 0;
  background: ${({ $tone }) => ($tone === 'muted' ? 'linear-gradient(180deg, #c1c7ce 0%, #b1b8c0 100%)' : 'linear-gradient(180deg, #0b5f97 0%, #0f6aa7 100%)')};
  box-shadow: ${({ $tone }) => ($tone === 'muted' ? 'none' : '0 10px 18px rgba(11, 95, 151, 0.22)')};
`;

const BarLabel = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: var(--text-muted);
`;

const BarChart = ({ items, maxHour }: BarChartProps) => {
  const ticks = [0, 0.5, 1, 1.5, 2, 2.5];
  const safeMax = maxHour || 1;

  return (
    <ChartFrame>
      <AxisColumn>
        <TickList>
          {ticks.map((tick) => (
            <TickLabel key={tick} $bottom={(tick / safeMax) * 100}>
              {tick === 0 ? '0' : `${tick}h`}
            </TickLabel>
          ))}
        </TickList>
      </AxisColumn>

      <PlotArea>
        {ticks.map((tick) => (
          <GridLine key={tick} $bottom={(tick / safeMax) * 100} />
        ))}

        <BarList>
          {items.map((item) => (
            <BarGroup key={item.id}>
              <BarValue>{formatHourValue(item.hours)}</BarValue>
              <BarTrack>
                <Bar $height={(item.hours / safeMax) * 100} $tone={(item.tone as 'primary' | 'muted') || 'primary'} />
              </BarTrack>
              <BarLabel>{item.label}</BarLabel>
            </BarGroup>
          ))}
        </BarList>
      </PlotArea>
    </ChartFrame>
  );
};

export default BarChart;
