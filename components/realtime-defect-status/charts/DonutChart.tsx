'use client';

import { useMemo } from 'react';
import styled from 'styled-components';
import { getToneColor } from '../model/helpers';
import type { DefectTypeStat } from '../model/types';

interface DonutChartProps {
  items: DefectTypeStat[];
  total: number;
}

const RADIUS = 56;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DonutChart = ({ items, total }: DonutChartProps) => {
  const segments = useMemo(() => {
    let accumulated = 0;

    return items.map((item) => {
      const valueLength = (item.value / total) * CIRCUMFERENCE;
      const offset = CIRCUMFERENCE - accumulated;
      accumulated += valueLength;

      return {
        ...item,
        color: getToneColor(item.tone),
        dasharray: `${valueLength} ${CIRCUMFERENCE - valueLength}`,
        dashoffset: offset
      };
    });
  }, [items, total]);

  return (
    <Wrap>
      <Svg viewBox="0 0 160 160" aria-label="불량 유형 분포 차트">
        <Track cx="80" cy="80" r={RADIUS} />
        {segments.map((segment) => (
          <ValueCircle
            key={segment.id}
            cx="80"
            cy="80"
            r={RADIUS}
            stroke={segment.color}
            strokeDasharray={segment.dasharray}
            strokeDashoffset={segment.dashoffset}
          />
        ))}
      </Svg>

      <Center>
        <CenterValue>{total}</CenterValue>
        <CenterLabel>총 분류 비중</CenterLabel>
      </Center>
    </Wrap>
  );
};

const Wrap = styled.div`
  position: relative;
  width: 440px;
  height: 440px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
`;

const Svg = styled.svg`
  width: 440px;
  height: 440px;
  transform: rotate(-90deg);
`;

const Track = styled.circle`
  fill: none;
  /* ✨ 배경 궤도 색상도 다크 테마에 맞게 은은하게 조정 */
  stroke: rgba(133, 154, 194, 0.16);
  stroke-width: 22;
`;

const ValueCircle = styled.circle`
  fill: none;
  stroke-width: 22;
  stroke-linecap: butt;
  transition: stroke-dasharray 260ms ease, stroke-dashoffset 260ms ease;
  filter: drop-shadow(0 0 12px rgba(79, 143, 255, 0.14));
`;

const Center = styled.div`
  position: absolute;
  inset: 0;
  /* ✨ 텍스트 겹침 방지 및 완벽한 중앙 정렬을 위해 Flexbox 사용 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
`;

const CenterValue = styled.div`
  /* ✨ 숫자 크기를 대폭 키우고 쨍한 흰색으로 변경 */
  font-size: 80px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.05em;
  color: #ffffff; 
`;

const CenterLabel = styled.div`
  /* ✨ 라벨 폰트 크기를 키우고 다크 테마에서 잘 보이는 색상으로 변경 */
  margin-top: 4px;
  font-size: 35px;
  font-weight: 600;
  color: #9ab0da; 
`;

export default DonutChart;