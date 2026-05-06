'use client';

import styled from 'styled-components';
import GlobalStyle from '../GlobalStyle';
import HeaderSection from '../HeaderSection';
import OverviewPanel from '../OverviewPanel';
import RepairHistoryPanel from '../RepairHistoryPanel';
import { useRealTimeDefectStatusDashboard } from '../hooks/useRealTimeDefectStatusDashboard';
import { useThemeStore } from '@/store/useThemeStore'; // 상태 관리 스토어 경로에 맞게 수정해주세요.

const RealTimeDefectStatusDashboard = () => {
  const {
    summaryCards,
    repairTimeStats,
    maxRepairHour,
    now,
    selectedHistoryId,
    actions
  } = useRealTimeDefectStatusDashboard();

  // ✨ 전역 테마 상태 불러오기
  const { isDark } = useThemeStore();

  return (
    <>
      <GlobalStyle />

      <PageShell $isDark={isDark}>
        <Frame $isDark={isDark}>
          {/* 하위 컴포넌트들에서도 테마를 사용할 수 있도록 isDark 프롭스 전달 */}
          <HeaderSection summaryCards={summaryCards} now={now} isDark={isDark} />

          <DashboardGrid>
            <OverviewPanel
              repairTimeStats={repairTimeStats}
              maxRepairHour={maxRepairHour}
              isDark={isDark}
            />

            <RepairHistoryPanel
              selectedId={selectedHistoryId}
              onSelect={actions.selectHistory}
              isDark={isDark}
            />
          </DashboardGrid>
        </Frame>
      </PageShell>
    </>
  );
};

// --- Styled Components ---

const PageShell = styled.main<{ $isDark: boolean }>`
  min-height: 100vh;
  min-height: 100dvh;
  padding: 22px;
  overflow: hidden;
  /* ✨ 애플 스타일의 화이트 테마와 모던한 다크 테마 분기 */
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(180deg, #1c1c1e 0%, #151516 100%)'
      : 'linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%)'};
  transition: background 0.4s cubic-bezier(0.25, 1, 0.5, 1);

  @supports (min-height: 100dvh) {
    min-height: 100dvh;
  }
`;

const Frame = styled.div<{ $isDark: boolean }>`
  position: relative;
  height: calc(100vh - 44px);
  height: calc(100dvh - 44px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 18px;
  min-height: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    /* ✨ 배경 그리드 선의 색상을 테마에 맞게 아주 연하게 조정 */
    background: ${({ $isDark }) =>
      $isDark
        ? `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
           linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`
        : `linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
           linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)`};
    background-size: 28px 28px;
    mask-image: radial-gradient(circle at center, black 22%, transparent 82%);
    opacity: ${({ $isDark }) => ($isDark ? 0.3 : 0.6)};
    transition: opacity 0.4s ease;
  }
`;

const DashboardGrid = styled.section`
  position: relative;
  z-index: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  gap: 18px;
  overflow: hidden;

  @media (max-width: 1320px) {
    grid-template-columns: minmax(0, 1fr) 380px;
  }

  @media (max-width: 1140px) {
    grid-template-columns: 1fr;
  }
`;

export default RealTimeDefectStatusDashboard;