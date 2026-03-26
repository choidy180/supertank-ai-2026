'use client';

import CheckpointDetailCard from '../CheckpointDetailCard';
import HeaderSection from '../HeaderSection';
import InspectionHistoryPanel from '../InspectionHistoryPanel';
import OverviewPanel from '../OverviewPanel';
import ProductionLinesPanel from '../ProductionLinesPanel';
import TimeSlotPanel from '../TimeSlotPanel';
import { useSmartFactoryDashboard } from '../hooks/useSmartFactoryDashboard';
import {
  CenterPanel,
  DashboardGrid,
  LeftColumn,
  PageShell,
  RightPanel
} from '../shared/styles';

const TimeCheckDashboard = () => {
  const {
    state,
    timeSlots,
    selectedLine,
    selectedCheckpoint,
    selectedTimeSlot,
    completionRate,
    okCount,
    warningCount,
    errorCount,
    visibleLogs,
    actions
  } = useSmartFactoryDashboard();

  return (
    <PageShell>
      <HeaderSection
        okCount={okCount}
        warningCount={warningCount}
        errorCount={errorCount}
        autoRun={state.autoRun}
        onToggleAutoRun={actions.toggleAutoRun}
      />

      <DashboardGrid>
        <LeftColumn>
          <OverviewPanel
            completionRate={completionRate}
            selectedTimeSlotLabel={selectedTimeSlot.label}
            lineCount={state.lines.length}
          />

          <TimeSlotPanel
            timeSlots={timeSlots}
            selectedTimeSlotId={state.selectedTimeSlotId}
            onSelectTimeSlot={actions.selectTimeSlot}
          />
        </LeftColumn>

        <CenterPanel>
          <ProductionLinesPanel
            lines={state.lines}
            selectedLineId={state.selectedLineId}
            selectedCheckpointId={state.selectedCheckpointId}
            selectedTimeSlotLabel={selectedTimeSlot.label}
            onSelectLine={actions.selectLine}
            onSelectCheckpoint={actions.selectCheckpoint}
          />

          {selectedLine && selectedCheckpoint && (
            <CheckpointDetailCard
              selectedLine={selectedLine}
              selectedCheckpoint={selectedCheckpoint}
              selectedTimeSlotLabel={selectedTimeSlot.label}
              onManualUpdate={actions.manualUpdate}
            />
          )}
        </CenterPanel>

        <RightPanel>
          <InspectionHistoryPanel
            logs={visibleLogs}
            filter={state.logFilter}
            selectedLineId={state.selectedLineId}
            selectedCheckpointId={state.selectedCheckpointId}
            onChangeFilter={actions.setLogFilter}
            onFocusLog={actions.selectCheckpoint}
          />
        </RightPanel>
      </DashboardGrid>
    </PageShell>
  );
};

export default TimeCheckDashboard;
