'use client';

import styled from 'styled-components';
import ActionHistoryPanel from '../ActionHistoryPanel';
import DowntimeStatsPanel from '../DowntimeStatsPanel';
import GlobalStyle from '../GlobalStyle';
import HeaderSection from '../HeaderSection';
import { useEquipmentManagementDashboard } from '../hooks/useEquipmentManagementDashboard';
import LiveStatusPanel from '../LiveStatusPanel';
import { formatClock } from '../model/helpers';

const EquipmentManagementDashboard = () => {
  const {
    summary,
    visibleHistory,
    selectedHistory,
    downtimeStats,
    maxDowntime,
    topDowntime,
    averageAvailability,
    now,
    filter,
    actionHistory,
    actions
  } = useEquipmentManagementDashboard();

  return (
    <>
      <GlobalStyle />

      <PageShell>
        <Frame>
          <HeaderSection
            nowLabel={formatClock(now)}
            totalCount={actionHistory.length}
            averageAvailability={averageAvailability}
          />

          <DashboardGrid>
            <LeftColumn>
              <LiveStatusPanel summary={summary} />
              <DowntimeStatsPanel
                items={downtimeStats}
                maxDowntime={maxDowntime}
                topDowntimeName={topDowntime.name}
                averageAvailability={averageAvailability}
              />
            </LeftColumn>

            <ActionHistoryPanel
              items={visibleHistory}
              filter={filter}
              selectedId={selectedHistory?.id ?? null}
              selectedItem={selectedHistory}
              onSelect={actions.setSelectedId}
              onChangeFilter={actions.setFilter}
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
  background: var(--color-background);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    padding: 18px;
    overflow: visible;
  }
`;

const Frame = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 18px;
  height: calc(100vh - 44px);
  height: calc(100dvh - 44px);
  min-height: 0;

  @media (max-width: 768px) {
    height: auto;
    min-height: calc(100vh - 36px);
  }
`;

const DashboardGrid = styled.section`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 640px minmax(0, 1fr);
  gap: 18px;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1320px) {
    grid-template-columns: 320px minmax(0, 1fr);
  }

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
    overflow: visible;
  }
`;

const LeftColumn = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  gap: 18px;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1120px) {
    overflow: visible;
  }
`;

export default EquipmentManagementDashboard;
