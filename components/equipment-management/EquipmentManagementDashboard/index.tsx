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
  background:
    radial-gradient(circle at 0% 0%, rgba(47, 93, 180, 0.16) 0%, rgba(47, 93, 180, 0) 28%),
    radial-gradient(circle at 100% 0%, rgba(14, 36, 77, 0.28) 0%, rgba(14, 36, 77, 0) 34%),
    linear-gradient(180deg, #07111f 0%, #040c17 48%, #020812 100%);
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
      linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
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
  grid-template-columns: 640px minmax(0, 1fr);
  gap: 18px;
  overflow: hidden;

  @media (max-width: 1320px) {
    grid-template-columns: 320px minmax(0, 1fr);
  }

  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto;
  gap: 18px;
  overflow: hidden;
`;

export default EquipmentManagementDashboard;
