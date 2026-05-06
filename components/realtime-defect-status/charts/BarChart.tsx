'use client';

import { useMemo } from 'react';
import styled from 'styled-components';
import { formatHours } from '../model/helpers';
import type { RepairTimeStat } from '../model/types';

interface BarChartProps {
  items: RepairTimeStat[];
  maxValue: number;
  // ✨ 테마 프롭스 추가
  isDark: boolean;
}

const BarChart = ({ items, isDark }: BarChartProps) => {
  const chartMax = useMemo(() => {
    const highest = Math.max(...items.map(item => item.hours), 0);
    return highest > 0 ? highest * 1.2 : 3;
  }, [items]);

  const yAxisTicks = useMemo(() => {
    return [0, chartMax * 0.33, chartMax * 0.66, chartMax].reverse();
  }, [chartMax]);

  return (
    <ChartWrap>
      <YAxis>
        {yAxisTicks.map((value, i) => (
          <AxisLabel key={i} $isDark={isDark}>
            {value === 0 ? '0' : `${value.toFixed(1)}h`}
          </AxisLabel>
        ))}
      </YAxis>

      <Canvas>
        <GridLines>
          {yAxisTicks.map((_, i) => (
            <GridLine key={i} $isDark={isDark} />
          ))}
        </GridLines>

        <Bars>
          {items.map((item) => (
            <BarColumn key={item.id}>
              <BarValue $isDark={isDark}>{formatHours(item.hours)}</BarValue>
              <BarTrack $isDark={isDark}>
                <BarFill 
                  $height={(item.hours / chartMax) * 100} 
                  $isDark={isDark} 
                />
              </BarTrack>
              <BarLabel $isDark={isDark}>{item.label}</BarLabel>
            </BarColumn>
          ))}
        </Bars>
      </Canvas>
    </ChartWrap>
  );
};

// --- Styled Components ---

const ChartWrap = styled.div`
  display: grid;
  grid-template-columns: 50px minmax(0, 1fr);
  gap: 12px;
  height: 100%;
  padding-top: 10px;
`;

const YAxis = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 34px;
`;

const AxisLabel = styled.div<{ $isDark: boolean }>`
  font-size: 13px; /* 폰트 크기를 애플 UI 가이드에 맞게 축소 */
  font-weight: 500;
  color: ${({ $isDark }) => ($isDark ? '#8e8e93' : '#86868b')};
  text-align: right;
  padding-right: 8px;
`;

const Canvas = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const GridLines = styled.div`
  position: absolute;
  top: 32px; 
  bottom: 34px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const GridLine = styled.div<{ $isDark: boolean }>`
  /* 점선보다 더 깔끔한 실선 테마 */
  border-top: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)')};
  width: 100%;
`;

const Bars = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
`;

const BarColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`;

const BarValue = styled.div<{ $isDark: boolean }>`
  font-size: 13px;
  font-weight: 700;
  color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#1d1d1f')};
  margin-bottom: 8px;
`;

const BarTrack = styled.div<{ $isDark: boolean }>`
  width: 32px; /* 바 두께를 살짝 줄여 더 세련되게 수정 */
  flex: 1;
  background: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)')};
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
`;

const BarFill = styled.div<{ $height: number; $isDark: boolean }>`
  width: 100%;
  height: ${({ $height }) => `${$height}%`};
  /* 그라데이션 제거: 애플 시스템 블루 단색 적용 */
  background-color: ${({ $isDark }) => ($isDark ? '#0a84ff' : '#007aff')};
  border-radius: 4px 4px 0 0;
  /* 그림자(Glow) 제거 */
  transition: height 0.6s cubic-bezier(0.23, 1, 0.32, 1);
`;

const BarLabel = styled.div<{ $isDark: boolean }>`
  margin-top: 12px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $isDark }) => ($isDark ? '#e5e5ea' : '#515154')};
`;

export default BarChart;