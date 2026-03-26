'use client';

import styled from 'styled-components';
import BarChart from '../charts/BarChart';
import type { RepairTimeStat } from '../model/types';

interface RepairTimePanelProps {
  items: RepairTimeStat[];
  maxValue: number;
}

const RepairTimePanel = ({ items, maxValue }: RepairTimePanelProps) => {
  return (
    <PanelCard>
      <PanelHeader>
        <div>
          <PanelTitle>평균 수리 시간</PanelTitle>
        </div>
        <MetaPill>최근 7일</MetaPill>
      </PanelHeader>

      {/* ✨ 차트가 남는 공간을 전부 밀고 나가도록 컨테이너로 감쌈 */}
      <ChartContainer>
        <BarChart items={items} maxValue={maxValue} />
      </ChartContainer>
    </PanelCard>
  );
};

// --- Styled Components ---

const PanelCard = styled.section`
  /* ✨ 기존 grid에서 flex-column으로 변경하여 세로 공간을 유연하게 배분 */
  display: flex;
  flex-direction: column;
  gap: 12px; /* ✨ 상단 헤더와 차트 사이의 간격을 18px -> 12px로 대폭 축소 */
  flex: 1; /* ✨ 패널 자체가 부모의 남은 세로 공간을 전부 차지하도록 설정 */
  min-height: 0;
  padding: 20px;
  border-radius: 24px;
  border: 1px solid var(--border-soft);
  background: linear-gradient(180deg, rgba(9, 19, 39, 0.96) 0%, rgba(7, 15, 31, 0.98) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 18px 48px rgba(0, 0, 0, 0.22);
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  flex-shrink: 0; /* ✨ 차트가 커져도 헤더 영역은 찌그러지지 않도록 보호 */
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff; /* ✨ 다크 테마에서 확실히 보이게 흰색 강제 */
`;

const PanelCaption = styled.p`
  margin: 6px 0 0;
  font-size: 20px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

const MetaPill = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 6px 20px;
  border-radius: 999px;
  border: 1px solid rgba(86, 212, 255, 0.18);
  background: rgba(86, 212, 255, 0.08);
  font-size: 20px;
  font-weight: 700;
  color: #c7ecee;
  white-space: nowrap;
`;

const ChartContainer = styled.div`
  /* ✨ 빈 공간 없이 차트를 위아래로 쫙 늘려주는 마법의 속성 */
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