'use client';

import styled from 'styled-components';
import GlobalStyle from '../GlobalStyle';
import HeaderSection from '../HeaderSection';
import OverviewPanel from '../OverviewPanel';
import RepairHistoryPanel from '../RepairHistoryPanel';
import { useRealTimeDefectStatusDashboard } from '../hooks/useRealTimeDefectStatusDashboard';

const RealTimeDefectStatusDashboard = () => {
  const {
    summaryCards,
    defectTypeStats,
    repairTimeStats,
    repairHistory,
    totalDefectValue,
    largestDefect,
    maxRepairHour,
    now,
    selectedHistoryId,
    actions
  } = useRealTimeDefectStatusDashboard();

  return (
    <>
      <GlobalStyle />

      <PageShell>
        <Frame>
          <HeaderSection summaryCards={summaryCards} now={now} />

          <DashboardGrid>
            <OverviewPanel
              summaryCards={summaryCards}
              defectTypeStats={defectTypeStats}
              repairTimeStats={repairTimeStats}
              totalDefectValue={totalDefectValue}
              maxRepairHour={maxRepairHour}
              largestDefectLabel={largestDefect.label}
            />

            <RepairHistoryPanel
              items={repairHistory}
              selectedId={selectedHistoryId}
              onSelect={actions.selectHistory}
            />
          </DashboardGrid>
        </Frame>
      </PageShell>
    </>
  );
};

const PageShell = styled.main`
  min-height: 100vh;
  min-height: 100dvh;
  padding: 22px;
  overflow: hidden;
  background:
    radial-gradient(circle at 0% 0%, rgba(47, 93, 180, 0.16) 0%, rgba(47, 93, 180, 0) 28%),
    radial-gradient(circle at 100% 0%, rgba(14, 36, 77, 0.28) 0%, rgba(14, 36, 77, 0) 34%),
    linear-gradient(180deg, #07111f 0%, #040c17 48%, #020812 100%);

  @supports (min-height: 100dvh) {
    min-height: 100dvh;
  }
`;

const Frame = styled.div`
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
    background:
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(circle at center, black 22%, transparent 82%);
    opacity: 0.12;
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
