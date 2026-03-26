'use client';

import { useMemo } from 'react';
import styled from 'styled-components';
import { formatHours } from '../model/helpers';
import type { RepairTimeStat } from '../model/types';

interface BarChartProps {
  items: RepairTimeStat[];
  maxValue: number; // 부모로부터 받지만 내부에서 보정함
}

const BarChart = ({ items, maxValue }: BarChartProps) => {
  // ✨ 핵심: 데이터 중 최대값을 찾아 차트의 천장(SafeMax)을 재설정
  // 데이터가 다 낮으면(예: 전부 1h 미만) 차트가 너무 커 보이지 않게 최소 1은 유지
  const chartMax = useMemo(() => {
    const highest = Math.max(...items.map(item => item.hours), 0);
    return highest > 0 ? highest * 1.2 : 3; // 가장 높은 바가 전체 높이의 80% 정도 차지하게 여유(1.2)를 줌
  }, [items]);

  // ✨ 보정된 최대값에 맞춰 Y축 눈금 4개를 생성
  const yAxisTicks = useMemo(() => {
    return [0, chartMax * 0.33, chartMax * 0.66, chartMax].reverse();
  }, [chartMax]);

  return (
    <ChartWrap>
      <YAxis>
        {yAxisTicks.map((value, i) => (
          <AxisLabel key={i}>
            {value === 0 ? '0' : `${value.toFixed(1)}h`}
          </AxisLabel>
        ))}
      </YAxis>

      <Canvas>
        <GridLines>
          {yAxisTicks.map((_, i) => (
            <GridLine key={i} />
          ))}
        </GridLines>

        <Bars>
          {items.map((item) => (
            <BarColumn key={item.id}>
              <BarValue>{formatHours(item.hours)}</BarValue>
              <BarTrack>
                {/* ✨ 보정된 chartMax 기준으로 높이 비율 계산 */}
                <BarFill $height={(item.hours / chartMax) * 100} />
              </BarTrack>
              <BarLabel>{item.label}</BarLabel>
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
  height: 100%; /* 부모 컨테이너(RepairTimePanel) 높이를 꽉 채움 */
  padding-top: 10px;
`;

const YAxis = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 34px; /* 라벨(월,화...) 높이만큼 띄움 */
`;

const AxisLabel = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #d8dadd;
  text-align: right;
  padding-right: 4px;
`;

const Canvas = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const GridLines = styled.div`
  position: absolute;
  /* 상단 수치(BarValue)와 하단 라벨(BarLabel) 공간을 제외한 바 영역에만 선 배치 */
  top: 32px; 
  bottom: 34px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const GridLine = styled.div`
  border-top: 1px dashed rgba(133, 154, 194, 0.2);
  width: 100%;
`;

const Bars = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 16px;
`;

const BarColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 아래쪽 정렬 */
  align-items: center;
  height: 100%;
`;

const BarValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
`;

const BarTrack = styled.div`
  width: 60px;
  flex: 1; /* ✨ 여기가 핵심: 바 트랙이 세로로 남는 공간을 꽉 채움 */
  background: rgba(133, 154, 194, 0.1);
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
`;

const BarFill = styled.div<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => `${$height}%`};
  background: linear-gradient(180deg, #62a0ff 0%, #3f7aff 100%);
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(63, 122, 255, 0.4);
  transition: height 0.5s ease-out;
`;

const BarLabel = styled.div`
  margin-top: 12px;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
`;

export default BarChart;