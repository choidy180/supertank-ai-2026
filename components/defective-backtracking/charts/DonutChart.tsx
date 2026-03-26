import { Fragment, useMemo } from 'react';
import styled from 'styled-components';
import type { DefectTypeStat } from '../model/types';
import { formatPercent } from '../model/helpers';

interface DonutChartProps {
  items: DefectTypeStat[];
}

const size = 232;
const strokeWidth = 42;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;
const center = size / 2;

const ChartWrap = styled.div`
  display: grid;
  place-items: center;
`;

const ChartSvg = styled.svg`
  width: min(100%, 248px);
  height: auto;
`;

const TrackCircle = styled.circle`
  fill: none;
  stroke: rgba(181, 189, 198, 0.18);
  stroke-width: ${strokeWidth};
`;

const SegmentCircle = styled.circle<{ $color: string; $dash: number; $offset: number }>`
  fill: none;
  stroke: ${({ $color }) => $color};
  stroke-width: ${strokeWidth};
  stroke-dasharray: ${({ $dash }) => `${$dash} ${circumference - $dash}`};
  stroke-dashoffset: ${({ $offset }) => -$offset};
  stroke-linecap: butt;
  transform: rotate(-90deg);
  transform-origin: ${center}px ${center}px;
`;

const SegmentLabel = styled.text`
  fill: white;
  font-size: 18px;
  font-weight: 800;
  text-anchor: middle;
  dominant-baseline: middle;
`;

const DonutChart = ({ items }: DonutChartProps) => {
  const segments = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
    let accumulated = 0;

    return items.map((item) => {
      const ratio = item.value / total;
      const dash = circumference * ratio;
      const offset = circumference * (accumulated / total);
      const startAngle = accumulated / total * Math.PI * 2 - Math.PI / 2;
      const midAngle = startAngle + ratio * Math.PI;
      const labelRadius = radius - strokeWidth / 2;
      const x = center + Math.cos(midAngle) * labelRadius;
      const y = center + Math.sin(midAngle) * labelRadius;

      accumulated += item.value;

      return {
        ...item,
        dash,
        offset,
        x,
        y
      };
    });
  }, [items]);

  return (
    <ChartWrap>
      <ChartSvg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="불량 유형별 비중 도넛 차트">
        <TrackCircle cx={center} cy={center} r={radius} />

        {segments.map((segment) => (
          <Fragment key={segment.id}>
            <SegmentCircle
              cx={center}
              cy={center}
              r={radius}
              $color={segment.color}
              $dash={segment.dash}
              $offset={segment.offset}
            />
            <SegmentLabel x={segment.x} y={segment.y}>
              {formatPercent(segment.value)}
            </SegmentLabel>
          </Fragment>
        ))}
      </ChartSvg>
    </ChartWrap>
  );
};

export default DonutChart;
