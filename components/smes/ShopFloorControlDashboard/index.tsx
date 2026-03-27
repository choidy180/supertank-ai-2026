'use client';

import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import AchievementPanel from '../AchievementPanel';
import DetailInfoPanel from '../DetailInfoPanel';
import EquipmentStatusPanel from '../EquipmentStatusPanel';
import GlobalStyle from '../GlobalStyle';
import LotHistoryPanel from '../LotHistoryPanel';
import MainHeader from '../MainHeader';
import OutputSummaryStrip from '../OutputSummaryStrip';
import PlanPanel from '../PlanPanel';
import DowntimeHistoryPanel from '../DowntimeHistoryPanel';
import WindowBar from '../WindowBar';
import WorkOrderPanel from '../WorkOrderPanel';
import {
  DETAIL_SECTIONS,
  DOWNTIME_HISTORY_ROWS,
  EQUIPMENT_STATUS_TILES,
  KPI_METRICS,
  LOT_HISTORY_ROWS,
  PRODUCT_INFO,
  QUICK_METRICS,
  SUMMARY_METRICS,
  WORK_ORDER_ROWS
} from '../model/constants';

const PageShell = styled.main`
  min-height: 100vh;
  max-height: 100vh;
  background: linear-gradient(180deg, #d6dde6 0%, #cfd6df 100%);
  padding-bottom: 20px;
`;

const WindowSurface = styled.div`
  min-height: calc(100vh - 12px);
  /* border-radius: 12px; */
  overflow: hidden;
  /* border: 1px solid #9ea9b6; */
  background: linear-gradient(180deg, #eef2f6 0%, #dde4ec 100%);
  box-shadow:
    0 24px 60px rgba(56, 71, 90, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  max-height: 100vh;
  padding-bottom: 20px;
`;

const Content = styled.div`
  display: flex; /* grid -> flex 변경 */
  gap: 10px;
  height: calc(100vh - 104px);
  padding: 10px;
  background: linear-gradient(180deg, #e1e7ee 0%, #d7dee7 100%);
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1.82; /* grid-template-columns의 1.82fr 역할 */
  min-width: 0;
  gap: 10px;

  /* 각 패널의 높이를 기존 grid-template-rows처럼 할당 */
  > :nth-child(1) {
    flex: 0 0 240px; /* AchievementPanel 높이 고정 */
  }
  > :nth-child(2) {
    flex: 0 0 120px; /* OutputSummaryStrip 높이 고정 */
  }
  > :nth-child(3) {
    flex: 1; /* DetailInfoPanel 나머지 영역 꽉 채움 */
    min-height: 0;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1; /* grid-template-columns의 1fr 역할 */
  min-width: 420px; /* 기존 minmax(420px, 1fr) 방어 로직 */
  gap: 10px;
  
  /* 💡 요청하신 최대 높이 및 스크롤 설정 */
  max-height: calc(100vh - 100px);
  overflow-y: auto;

  /* 스크롤바 디자인 (선택사항, 깔끔하게 보이도록 추가) */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(158, 169, 182, 0.6);
    border-radius: 4px;
  }

  /* 각 패널의 높이 및 비율 분배 */
  > :nth-child(1) {
    min-height: 264px;
  }
  > :nth-child(2) {
    min-height: 320px;
  }
  > :nth-child(3) {
    min-height: 260px;
  }
  > :nth-child(4) {
    min-height: 260px;
  }
  > :nth-child(5) {
    min-height: 220px;
  }
`;

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function formatHeaderDateTime(date: Date) {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = date.getHours();
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());
  const meridiem = hour >= 12 ? '오후' : '오전';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${year}-${month}-${day} ${meridiem} ${hour12}:${minute}:${second}`;
}

function formatClock(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function ShopFloorControlDashboard() {
  const [now, setNow] = useState(() => new Date());
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState(WORK_ORDER_ROWS[0]?.id ?? '');
  const [selectedDowntimeId, setSelectedDowntimeId] = useState(DOWNTIME_HISTORY_ROWS[2]?.id ?? DOWNTIME_HISTORY_ROWS[0]?.id ?? '');
  const [selectedLotId, setSelectedLotId] = useState(LOT_HISTORY_ROWS[0]?.id ?? '');

  // Hydration mismatch 방지를 위해 클라이언트 마운트 여부 확인
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // 마운트 완료
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const headerDateTime = useMemo(() => formatHeaderDateTime(now), [now]);
  const updateTime = useMemo(() => formatClock(now), [now]);

  return (
    <>
      <GlobalStyle />

      <PageShell>
        <WindowSurface>
          <WindowBar />
          {/* Hydration 이슈가 있는 시간을 처리하기 위한 방어 코드 추가 (옵션) */}
          <MainHeader currentDateTime={isMounted ? headerDateTime : ''} />

          <Content>
            <LeftColumn>
              <AchievementPanel summaryMetrics={SUMMARY_METRICS} kpiMetrics={KPI_METRICS} />
              <OutputSummaryStrip metrics={QUICK_METRICS} updateTime={isMounted ? updateTime : ''} />
              <DetailInfoPanel sections={DETAIL_SECTIONS} />
            </LeftColumn>

            <RightColumn>
              <PlanPanel product={PRODUCT_INFO} />
              <EquipmentStatusPanel tiles={EQUIPMENT_STATUS_TILES} />
              <WorkOrderPanel rows={WORK_ORDER_ROWS} selectedId={selectedWorkOrderId} onSelect={setSelectedWorkOrderId} />
              <DowntimeHistoryPanel rows={DOWNTIME_HISTORY_ROWS} selectedId={selectedDowntimeId} onSelect={setSelectedDowntimeId} />
              <LotHistoryPanel rows={LOT_HISTORY_ROWS} selectedId={selectedLotId} onSelect={setSelectedLotId} />
            </RightColumn>
          </Content>
        </WindowSurface>
      </PageShell>
    </>
  );
}