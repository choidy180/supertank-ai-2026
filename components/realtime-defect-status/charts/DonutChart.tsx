'use client';

import { useMemo } from 'react';
import styled from 'styled-components';
import { getToneColor } from '../model/helpers';
import type { DefectTypeStat } from '../model/types';

interface DonutChartProps {
  items: DefectTypeStat[];
  total: number;
  // ✨ 테마 프롭스 추가
  isDark: boolean;
}

const RADIUS = 56;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DonutChart = ({ items, total, isDark }: DonutChartProps) => {
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
        <Track cx="80" cy="80" r={RADIUS} $isDark={isDark} />
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
        <CenterValue $isDark={isDark}>{total}</CenterValue>
        <CenterLabel $isDark={isDark}>총 분류 비중</CenterLabel>
      </Center>
    </Wrap>
  );
};

// --- Styled Components ---

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

const Track = styled.circle<{ $isDark: boolean }>`
  fill: none;
  /* 테마에 맞게 궤도(배경 선) 색상 변경 */
  stroke: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)')};
  stroke-width: 22;
  transition: stroke 0.3s ease;
`;

const ValueCircle = styled.circle`
  fill: none;
  stroke-width: 22;
  stroke-linecap: butt; /* 플랫한 느낌을 위해 유지 */
  transition: stroke-dasharray 260ms ease, stroke-dashoffset 260ms ease;
  /* ✨ 글로우(그림자) 효과를 제거하여 완벽한 플랫/단색 스타일 구현 */
`;

const Center = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
`;

const CenterValue = styled.div<{ $isDark: boolean }>`
  font-size: 80px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.04em;
  /* 테마별 텍스트 색상 전환 */
  color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#1d1d1f')};
  transition: color 0.3s ease;
`;

const CenterLabel = styled.div<{ $isDark: boolean }>`
  margin-top: 8px;
  font-size: 32px;
  font-weight: 600;
  letter-spacing: -0.02em;
  /* 테마별 보조 텍스트 색상 전환 */
  color: ${({ $isDark }) => ($isDark ? '#8e8e93' : '#86868b')};
  transition: color 0.3s ease;
`;

export default DonutChart;