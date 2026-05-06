'use client';

import styled from 'styled-components';
import DefectTypePanel from '../DefectTypePanel';
import RepairTimePanel from '../RepairTimePanel';
import SummaryCards from '../SummaryCards';
import type { RepairTimeStat } from '../model/types'; 

interface OverviewPanelProps {
  repairTimeStats: RepairTimeStat[];
  maxRepairHour: number;
  // ✨ 테마 상태를 받기 위한 isDark 프롭스 추가
  isDark: boolean;
}

const OverviewPanel = ({
  repairTimeStats,
  maxRepairHour,
  isDark
}: OverviewPanelProps) => {
  return (
    <Panel $isDark={isDark}>
      <PanelHeader>
        <MetaPill $isDark={isDark}>실시간 운영 보드</MetaPill>
      </PanelHeader>

      {/* 내부 컴포넌트들에도 테마 상태를 전달합니다 */}
      <SummaryCards isDark={isDark} />

      <ChartGrid>
        <DefectTypePanel isDark={isDark} />
        <RepairTimePanel 
          items={repairTimeStats} 
          maxValue={maxRepairHour} 
          isDark={isDark} 
        />
      </ChartGrid>
    </Panel>
  );
};

// --- Styled Components ---

const Panel = styled.section<{ $isDark: boolean }>`
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
  gap: 18px;
  padding: 24px;
  border-radius: 28px; /* 애플 스타일의 부드러운 라운딩 */
  
  /* 테마에 따른 배경, 테두리, 부드러운 그림자 효과 */
  border: 1px solid ${({ $isDark }) => 
    $isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'};
  background: ${({ $isDark }) => 
    $isDark 
      ? 'linear-gradient(180deg, #1c1c1e 0%, #151516 100%)' 
      : '#ffffff'};
  box-shadow: ${({ $isDark }) => 
    $isDark 
      ? '0 20px 40px rgba(0, 0, 0, 0.4)' 
      : '0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)'};
  
  overflow: hidden;
  transition: all 0.3s ease;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
`;

const MetaPill = styled.div<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  
  /* HeaderSection의 블루톤 테마와 통일감을 주는 스타일 */
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(10, 132, 255, 0.2)' : 'rgba(0, 122, 255, 0.2)')};
  background: ${({ $isDark }) => ($isDark ? 'rgba(10, 132, 255, 0.1)' : 'rgba(0, 122, 255, 0.08)')};
  color: ${({ $isDark }) => ($isDark ? '#5ac8fa' : '#007aff')};
  
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
  transition: all 0.3s ease;
`;

const ChartGrid = styled.div`
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(360px, 0.92fr) minmax(0, 1.08fr);
  gap: 18px;
  overflow: hidden;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
    overflow: auto;
  }
`;

export default OverviewPanel;