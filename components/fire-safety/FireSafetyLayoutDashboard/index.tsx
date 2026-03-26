'use client';

import CoordinateGuidePanel from '../CoordinateGuidePanel';
import FactoryLayoutPanel from '../FactoryLayoutPanel';
import GlobalStyle from '../GlobalStyle';
import HeaderSection from '../HeaderSection';
import InspectionDetailDrawer from '../InspectionDetailDrawer';
import InspectionHistoryPanel from '../InspectionHistoryPanel';
import ReplacementAlertPanel from '../ReplacementAlertPanel';
import SelectedEquipmentCard from '../SelectedEquipmentCard';
import StatusOverviewPanel from '../StatusOverviewPanel';
import { useFireSafetyDashboard } from '../hooks/useFireSafetyDashboard';
import { AppFrame, DashboardGrid, LeftColumn, PageShell } from '../shared/styles';

const FireSafetyLayoutDashboard = () => {
  const {
    factoryZones,
    inspectionHistory,
    allEquipments,
    selectedEquipment,
    selectedInspection,
    selectedInspectionId,
    stableCount,
    replaceNowCount,
    dueSoonCount,
    alertEquipments,
    relatedInspection,
    zoneInspectionCounts,
    actions
  } = useFireSafetyDashboard();

  return (
    <>
      <GlobalStyle />

      <PageShell>
        <AppFrame>
          <HeaderSection
            inspectionCount={inspectionHistory.length}
            stableCount={stableCount}
            dueSoonCount={dueSoonCount}
            replaceNowCount={replaceNowCount}
          />

          <DashboardGrid>
            <LeftColumn>
              <StatusOverviewPanel
                stableCount={stableCount}
                replaceNowCount={replaceNowCount}
                dueSoonCount={dueSoonCount}
              />

              <ReplacementAlertPanel
                alertEquipments={alertEquipments}
                selectedEquipmentId={selectedEquipment.id}
                onSelectEquipment={actions.selectEquipment}
              />

              <CoordinateGuidePanel />
            </LeftColumn>

            <FactoryLayoutPanel
              factoryZones={factoryZones}
              allEquipments={allEquipments}
              zoneInspectionCounts={zoneInspectionCounts}
              selectedEquipment={selectedEquipment}
              onSelectEquipment={actions.selectEquipment}
            >
              <SelectedEquipmentCard
                selectedEquipment={selectedEquipment}
                relatedInspection={relatedInspection}
              />
            </FactoryLayoutPanel>

            <InspectionHistoryPanel
              inspectionHistory={inspectionHistory}
              selectedInspectionId={selectedInspectionId}
              onOpenInspection={actions.openInspection}
            />
          </DashboardGrid>
        </AppFrame>
      </PageShell>

      <InspectionDetailDrawer
        selectedInspection={selectedInspection}
        selectedEquipment={selectedEquipment}
        onClose={actions.closeInspection}
      />
    </>
  );
};

export default FireSafetyLayoutDashboard;
