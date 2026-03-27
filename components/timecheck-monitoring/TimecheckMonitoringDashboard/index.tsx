'use client';

import styled from 'styled-components';
import GlobalStyle from '../GlobalStyle';
import DailyCompletionPanel from '../DailyCompletionPanel';
import IssuesPanel from '../IssuesPanel';
import MainScanningPanel from '../MainScanningPanel';
import SubViewSection from '../SubViewSection';
import SystemLogPanel from '../SystemLogPanel';
import TimecheckHistoryPanel from '../TimecheckHistoryPanel';
import { useTimecheckMonitoringDashboard } from '../hooks/useTimecheckMonitoringDashboard';

const PageShell = styled.main`
  min-height: 100vh;
  min-height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  padding: 18px;
  overflow: hidden;
`;

const DashboardFrame = styled.div`
  height: calc(100vh - 36px);
  height: calc(100dvh - 36px);
  min-height: 0;
  display: flex;
  flex-direction: column; /* 세로 배치 */
  gap: 14px;

  @media (max-width: 1280px) {
    height: auto;
    min-height: calc(100vh - 36px);
    min-height: calc(100dvh - 36px);
  }
`;

const TopArea = styled.div`
  flex: 1; /* grid-template-rows의 1fr 역할 (남은 공간 차지) */
  min-height: 0;
  display: flex; /* 가로 배치 */
  gap: 16px;

  /* SystemLogPanel (두 번째 자식) 고정 너비 설정 */
  > :last-child {
    flex: 0 0 500px; /* 넓어지거나 좁아지지 않고 420px 고정 */
    min-width: 0;
  }

  @media (max-width: 1280px) {
    flex-direction: column; /* 화면이 좁아지면 세로로 배치 */
    
    > :last-child {
      flex: 1 1 auto; /* 세로 모드일 때는 고정 너비 해제 */
    }
  }
`;

const LeftTopArea = styled.div`
  flex: 1; /* TopArea 안에서 남은 공간 모두 차지 (minmax(0, 1fr) 역할) */
  min-width: 0; /* Flex 자식 요소가 컨테이너를 뚫고 나가는 현상 방지 */
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const BottomArea = styled.div`
  display: flex; /* 가로 배치 */
  gap: 16px;
  min-height: 184px;

  /* grid-template-columns 비율(1.45 : 0.92 : 0.95)을 flex-grow로 구현 */
  > :nth-child(1) {
    flex: 1.45;
    min-width: 0;
  }
  > :nth-child(2) {
    flex: 1;
    min-width: 0;
  }
  > :nth-child(3) {
    flex: 0.95;
    min-width: 0;
  }

  @media (max-width: 1280px) {
    flex-direction: column; /* 화면이 좁아지면 세로로 배치 */
    
    > * {
      flex: 1 1 auto; /* 세로 모드일 때는 비율 해제 */
    }
  }
`;

export default function TimecheckMonitoringDashboard() {
  const {
    scannerInfo,
    systemLogs,
    materialInboundCard,
    fireSafetyCard,
    defectPredictionCard,
    timecheckHistory,
    dailyProgress,
    issueItems,
    autoScroll,
    toggleAutoScroll,
    elapsedLabel,
    logScrollRef,
    selectedHistoryId,
    selectHistory
  } = useTimecheckMonitoringDashboard();

  return (
    <>
      <GlobalStyle />

      <PageShell>
        <DashboardFrame>
          <TopArea>
            <LeftTopArea>
              <MainScanningPanel info={scannerInfo} elapsedLabel={elapsedLabel} />
              <SubViewSection
                materialInbound={materialInboundCard}
                fireSafety={fireSafetyCard}
                defectPrediction={defectPredictionCard}
              />
            </LeftTopArea>

            <SystemLogPanel
              logs={systemLogs}
              autoScroll={autoScroll}
              onToggleAutoScroll={toggleAutoScroll}
              scrollRef={logScrollRef}
            />
          </TopArea>

          <BottomArea>
            <TimecheckHistoryPanel
              items={timecheckHistory}
              selectedId={selectedHistoryId}
              onSelect={selectHistory}
            />
            <DailyCompletionPanel progress={dailyProgress} />
            <IssuesPanel items={issueItems} />
          </BottomArea>
        </DashboardFrame>
      </PageShell>
    </>
  );
}