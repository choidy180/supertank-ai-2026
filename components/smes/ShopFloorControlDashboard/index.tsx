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
import EquipmentChecklist from '../EquipmentChecklist';
import TimeCheckSheet from '../TimeCheckSheet';
import CriticalManagementPoint from '../CriticalManagementPoint';

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
  > :nth-child(2) { min-height: 350px; }
  > :nth-child(3) { min-height: 354px; }
  > :nth-child(4) { min-height: 260px; }
  > :nth-child(5) { min-height: 220px; }
`;

// 왼쪽 디테일 섹션과 탭 메뉴를 묶어줄 래퍼
const DetailSectionWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-height: 0;
`;

const MenuTabsWrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  background: var(--panel-bg, #ffffff);
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #b8c2ce;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0; /* 메뉴바가 찌그러지지 않도록 고정 */
`;

// 💡 글자 크기를 14px에서 18px로 키웠습니다.
const TabButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 10px 4px;
  border: 1px solid ${({ $active }) => ($active ? '#2b384b' : 'transparent')};
  background: ${({ $active }) => ($active ? '#2b384b' : '#f0f4f8')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#68778c')};
  border-radius: 6px;
  font-size: 18px; /* 💡 글자 크기 키움 */
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;

  &:hover {
    background: ${({ $active }) => ($active ? '#2b384b' : '#e2e8f0')};
  }
`;

// 💡 자동 버튼 글자 크기를 키우고, 활성화 시 색상을 빨간색에서 파란색(#007bff)으로 변경했습니다.
const AutoButton = styled.button<{ $active?: boolean }>`
  margin-left: auto;
  padding: 10px 16px;
  border: 1px solid ${({ $active }) => ($active ? '#007bff' : '#c6ced8')}; /* 💡 테두리 파란색 */
  background: ${({ $active }) => ($active ? '#007bff' : '#ffffff')}; /* 💡 배경 파란색 */
  color: ${({ $active }) => ($active ? '#ffffff' : '#007bff')}; /* 💡 글자색 파란색 */
  border-radius: 6px;
  font-size: 18px; /* 💡 글자 크기 키움 */
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  box-shadow: ${({ $active }) => ($active ? '0 0 8px rgba(0, 123, 255, 0.4)' : 'none')}; /* 💡 파란색 그림자 */

  &:hover {
    background: ${({ $active }) => ($active ? '#0056b3' : '#e6f7ff')}; /* 💡 호버 시 진한 파란색 / 연한 파란색 */
  }
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

export type SideMenuType = '사출조건표' | '설비점검표' | '타임체크시트' | '작업지도서' | '사출조건변동이력';

const MENUS: SideMenuType[] = ['사출조건표', '설비점검표', '타임체크시트', '작업지도서', '사출조건변동이력'];

export default function ShopFloorControlDashboard() {
  const [now, setNow] = useState(() => new Date());
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState(WORK_ORDER_ROWS[0]?.id ?? '');
  const [selectedDowntimeId, setSelectedDowntimeId] = useState(DOWNTIME_HISTORY_ROWS[2]?.id ?? DOWNTIME_HISTORY_ROWS[0]?.id ?? '');
  const [selectedLotId, setSelectedLotId] = useState(LOT_HISTORY_ROWS[0]?.id ?? '');
  
  const [selectedMenu, setSelectedMenu] = useState<SideMenuType>('사출조건표');
  
  // 💡 자동 켜짐을 디폴트로 설정했습니다 (false -> true).
  const [isAutoMode, setIsAutoMode] = useState(true);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isAutoMode) return;
    
    const interval = window.setInterval(() => {
      setSelectedMenu((prev) => {
        const currentIndex = MENUS.indexOf(prev);
        const nextIndex = (currentIndex + 1) % MENUS.length;
        return MENUS[nextIndex];
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isAutoMode]);

  const headerDateTime = useMemo(() => formatHeaderDateTime(now), [now]);
  const updateTime = useMemo(() => formatClock(now), [now]);

  const handleMenuClick = (menu: SideMenuType) => {
    setSelectedMenu(menu);
    setIsAutoMode(false);
  };

  const renderDetailSection = () => {
    switch (selectedMenu) {
      case '사출조건표':
        return <DetailInfoPanel sections={DETAIL_SECTIONS} />;
      case '설비점검표':
        return <EquipmentChecklist/>;
      case '타임체크시트':
        return <TimeCheckSheet/>;
      case '작업지도서':
        return <CriticalManagementPoint/>;
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
              
              <DetailSectionWrap>
                <MenuTabsWrap>
                  {MENUS.map((menu) => (
                    <TabButton 
                      key={menu} 
                      $active={selectedMenu === menu}
                      onClick={() => handleMenuClick(menu)}
                    >
                      {menu}
                    </TabButton>
                  ))}
                  <AutoButton 
                    $active={isAutoMode} 
                    onClick={() => setIsAutoMode((prev) => !prev)}
                  >
                    {isAutoMode ? '자동 켜짐' : '자동 꺼짐'}
                  </AutoButton>
                </MenuTabsWrap>

                {renderDetailSection()}
              </DetailSectionWrap>

            </LeftColumn>

            <RightColumn>
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