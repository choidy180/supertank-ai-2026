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
  background: linear-gradient(180deg, #d6dde6 0%, #cfd6df 100%);
  padding: 6px;
`;

const WindowSurface = styled.div`
  min-height: calc(100vh - 12px);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #9ea9b6;
  background: linear-gradient(180deg, #eef2f6 0%, #dde4ec 100%);
  box-shadow:
    0 24px 60px rgba(56, 71, 90, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.82fr) minmax(420px, 1fr);
  gap: 10px;
  min-height: calc(100vh - 118px);
  padding: 10px;
  background: linear-gradient(180deg, #e1e7ee 0%, #d7dee7 100%);
`;

const LeftColumn = styled.div`
  min-height: 0;
  display: grid;
  grid-template-rows: 190px 80px minmax(0, 1fr);
  gap: 10px;
`;

const RightColumn = styled.div`
  min-height: 0;
  display: grid;
  grid-template-rows: 244px 142px minmax(0, 1fr) minmax(0, 1.12fr) minmax(0, 0.98fr);
  gap: 10px;
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

  useEffect(() => {
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
          <MainHeader currentDateTime={headerDateTime} />

          <Content>
            <LeftColumn>
              <AchievementPanel summaryMetrics={SUMMARY_METRICS} kpiMetrics={KPI_METRICS} />
              <OutputSummaryStrip metrics={QUICK_METRICS} updateTime={updateTime} />
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
