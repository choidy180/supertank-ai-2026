'use client';

import GlobalStyle from '../GlobalStyle';
import OverviewPanel from '../OverviewPanel';
import RepairHistoryPanel from '../RepairHistoryPanel';
import { useRealTimeDefectStatusDashboard } from '../hooks/useRealTimeDefectStatusDashboard';
import { Frame, PageShell } from '../shared/styles';
import { DashboardGrid } from './styles';

const DefectiveBacktracking = () => {
  const {
    summaryCards,
    defectTypeStats,
    repairTimeStats,
    repairHistory,
    totalDefectValue,
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
          <DashboardGrid>
            <OverviewPanel
              summaryCards={summaryCards}
              defectTypeStats={defectTypeStats}
              repairTimeStats={repairTimeStats}
              totalDefectValue={totalDefectValue}
              maxRepairHour={maxRepairHour}
              now={now}
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

export default DefectiveBacktracking;
