'use client';

import styled from 'styled-components';
import BarChart from '../charts/BarChart';
import type { RepairTimeStat } from '../model/types';

interface RepairTimePanelProps {
  items: RepairTimeStat[];
  maxValue: number;
  // ✨ 테마 프롭스 추가
  isDark: boolean;
}

const RepairTimePanel = ({ items, maxValue, isDark }: RepairTimePanelProps) => {
  return (
    <PanelCard $isDark={isDark}>
      <PanelHeader>
        <div>
          <PanelTitle $isDark={isDark}>평균 수리 시간</PanelTitle>
        </div>
        <MetaPill $isDark={isDark}>최근 7일</MetaPill>
      </PanelHeader>

      <ChartContainer>
        {/* ✨ 하위 BarChart 컴포넌트에도 테마를 적용하기 위해 isDark를 넘겨줍니다. */}
        <BarChart items={items} maxValue={maxValue} isDark={isDark} />
      </ChartContainer>
    </PanelCard>
  );
};

// --- Styled Components ---

const PanelCard = styled.section<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1; 
  min-height: 0;
  padding: 24px; /* 다른 패널과 디자인 일치 */
  border-radius: 24px;
  
  /* ✨ 그라데이션 완벽 제거: 깔끔한 단색 배경 */
  background-color: ${({ $isDark }) => ($isDark ? '#1c1c1e' : '#ffffff')};
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)')};

  box-shadow: ${({ $isDark }) => 
    $isDark 
      ? '0 4px 16px rgba(0, 0, 0, 0.2)' 
      : '0 4px 16px rgba(0, 0, 0, 0.03), 0 1px 4px rgba(0, 0, 0, 0.02)'};
  transition: all 0.3s ease;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  flex-shrink: 0; 
`;

const PanelTitle = styled.h3<{ $isDark: boolean }>`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ $isDark }) => ($isDark ? '#f5f5f7' : '#1d1d1f')};
`;

const MetaPill = styled.div<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;

  /* 애플 블루 톤으로 통일 */
  background: ${({ $isDark }) => ($isDark ? 'rgba(10, 132, 255, 0.1)' : 'rgba(0, 122, 255, 0.08)')};
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(10, 132, 255, 0.2)' : 'rgba(0, 122, 255, 0.2)')};
  color: ${({ $isDark }) => ($isDark ? '#5ac8fa' : '#007aff')};
`;

const ChartContainer = styled.div`
  flex: 1; 
  min-height: 0;
  display: flex;
  flex-direction: column;

  /* ChartContainer 내부의 BarChart가 전체 공간을 쓰도록 유도 */
  & > div {
    height: 100%;
  }
`;

export default RepairTimePanel;