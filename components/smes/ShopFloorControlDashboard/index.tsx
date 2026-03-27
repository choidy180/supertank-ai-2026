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

// 💡 임시 박스용 스타일 컴포넌트 추가
const PlaceholderBox = styled.div<{ $bgColor: string }>`
  flex: 1;
  min-height: 0;
  border-radius: 10px;
  background-color: ${(props) => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const PageShell = styled.main`
  min-height: 100vh;
  max-height: 100vh;
  background: linear-gradient(180deg, #d6dde6 0%, #cfd6df 100%);
  padding-bottom: 20px;
`;

const WindowSurface = styled.div`
  min-height: calc(100vh - 12px);
  overflow: hidden;
  background: linear-gradient(180deg, #eef2f6 0%, #dde4ec 100%);
  box-shadow:
    0 24px 60px rgba(56, 71, 90, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  max-height: 100vh;
  padding-bottom: 20px;
`;

const Content = styled.div`
  display: flex;
  gap: 10px;
  height: calc(100vh - 104px);
  padding: 10px;
  background: linear-gradient(180deg, #e1e7ee 0%, #d7dee7 100%);
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1.82;
  min-width: 0;
  gap: 10px;

  > :nth-child(1) { flex: 0 0 240px; }
  > :nth-child(2) { flex: 0 0 120px; }
  > :nth-child(3) {
    flex: 1;
    min-height: 0;
  }
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 420px;
  gap: 10px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(158, 169, 182, 0.6);
    border-radius: 4px;
  }

  > :nth-child(1) { min-height: 264px; }
  > :nth-child(2) { min-height: 320px; }
  > :nth-child(3) { min-height: 260px; }
  > :nth-child(4) { min-height: 260px; }
  > :nth-child(5) { min-height: 220px; }
`;

function pad(value: number) { return String(value).padStart(2, '0'); }

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

// 💡 메뉴 타입을 명확하게 정의
export type SideMenuType = '사출조건표' | '설비점검표' | '타임체크시트' | '작업지도서' | '사출조건변동이력';

export default function ShopFloorControlDashboard() {
  const [now, setNow] = useState(() => new Date());
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState(WORK_ORDER_ROWS[0]?.id ?? '');
  const [selectedDowntimeId, setSelectedDowntimeId] = useState(DOWNTIME_HISTORY_ROWS[2]?.id ?? DOWNTIME_HISTORY_ROWS[0]?.id ?? '');
  const [selectedLotId, setSelectedLotId] = useState(LOT_HISTORY_ROWS[0]?.id ?? '');
  
  // 💡 선택된 탭 상태 추가 (기본값: 사출조건표)
  const [selectedMenu, setSelectedMenu] = useState<SideMenuType>('사출조건표');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const headerDateTime = useMemo(() => formatHeaderDateTime(now), [now]);
  const updateTime = useMemo(() => formatClock(now), [now]);

  // 💡 선택된 메뉴에 따라 렌더링할 하단 컴포넌트를 결정하는 함수
  const renderDetailSection = () => {
    switch (selectedMenu) {
      case '사출조건표':
        return <DetailInfoPanel sections={DETAIL_SECTIONS} />;
      case '설비점검표':
        return <PlaceholderBox $bgColor="#4A90E2">설비점검표 영역 (준비중)</PlaceholderBox>;
      case '타임체크시트':
        return <PlaceholderBox $bgColor="#50E3C2">타임체크시트 영역 (준비중)</PlaceholderBox>;
      case '작업지도서':
        return <PlaceholderBox $bgColor="#F5A623">작업지도서 영역 (준비중)</PlaceholderBox>;
      case '사출조건변동이력':
        return <PlaceholderBox $bgColor="#D0021B">사출조건변동이력 영역 (준비중)</PlaceholderBox>;
      default:
        return <DetailInfoPanel sections={DETAIL_SECTIONS} />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <PageShell>
        <WindowSurface>
          <WindowBar />
          <MainHeader currentDateTime={isMounted ? headerDateTime : ''} />

          <Content>
            <LeftColumn>
              <AchievementPanel summaryMetrics={SUMMARY_METRICS} kpiMetrics={KPI_METRICS} />
              <OutputSummaryStrip metrics={QUICK_METRICS} updateTime={isMounted ? updateTime : ''} />
              {/* 💡 조건부 렌더링 함수 실행 */}
              {renderDetailSection()}
            </LeftColumn>

            <RightColumn>
              {/* 💡 PlanPanel에 상태 변경 함수 전달 */}
              <PlanPanel 
                product={PRODUCT_INFO} 
                onSelectMenu={setSelectedMenu} 
              />
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