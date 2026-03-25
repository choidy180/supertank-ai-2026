
'use client';

import { useEffect, useMemo, useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';

type EquipmentHealth = 'normal' | 'warning' | 'critical';
type ReplacementState = 'stable' | 'due-soon' | 'replace-now';
type InspectionLevel = 'normal' | 'warning' | 'critical';
type CoordinateOrigin = 'top-left' | 'bottom-left';

interface FireEquipment {
  id: string;
  name: string;
  x: number;
  y: number;
  health: EquipmentHealth;
  replacementState: ReplacementState;
  pressure: '정상' | '주의' | '미달';
  installSpot: string;
  lastInspection: string;
  nextReplacement: string;
  note: string;
}

interface FactoryZone {
  id: string;
  name: string;
  floor: string;
  width: number;
  height: number;
  coordinateOrigin: CoordinateOrigin;
  equipments: FireEquipment[];
}

interface InspectionRecord {
  id: string;
  date: string;
  timeRange: string;
  level: InspectionLevel;
  zoneId: string;
  zoneName: string;
  equipmentId: string;
  equipmentName: string;
  inspector: string;
  summary: string;
  abnormality: string;
  action: string;
  detailTitle: string;
  details: string[];
}

interface FlattenedEquipment extends FireEquipment {
  zoneId: string;
  zoneName: string;
  zoneFloor: string;
  zoneWidth: number;
  zoneHeight: number;
  coordinateOrigin: CoordinateOrigin;
}

const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  :root {
    color-scheme: dark;
    --bg: #06101f;
    --surface-1: rgba(12, 23, 44, 0.96);
    --surface-2: rgba(16, 31, 58, 0.92);
    --surface-3: rgba(20, 39, 72, 0.86);
    --surface-4: rgba(24, 46, 85, 0.74);
    --border-soft: rgba(139, 160, 204, 0.14);
    --border-strong: rgba(100, 149, 255, 0.28);
    --text-strong: #f5f8ff;
    --text-primary: #dce6fb;
    --text-secondary: #9fb2d9;
    --text-muted: #7f95c2;
    --blue: #5b9cff;
    --blue-soft: rgba(91, 156, 255, 0.14);
    --green: #2fd184;
    --green-soft: rgba(47, 209, 132, 0.12);
    --amber: #ffbe57;
    --amber-soft: rgba(255, 190, 87, 0.12);
    --red: #ff6977;
    --red-soft: rgba(255, 105, 119, 0.12);
    --shadow-lg: 0 24px 68px rgba(0, 0, 0, 0.34);
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    background:
      radial-gradient(circle at 0% 0%, rgba(59, 96, 170, 0.18) 0%, rgba(59, 96, 170, 0) 30%),
      radial-gradient(circle at 100% 0%, rgba(28, 54, 102, 0.22) 0%, rgba(28, 54, 102, 0) 34%),
      linear-gradient(180deg, #091326 0%, #08101f 38%, #050b16 100%);
    color: var(--text-strong);
    font-family: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  body {
    overflow: hidden;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    border-radius: 999px;
    background: rgba(132, 155, 202, 0.34);
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  *::-webkit-scrollbar-thumb:hover {
    background: rgba(132, 155, 202, 0.48);
    border: 2px solid transparent;
    background-clip: padding-box;
  }
`;

const buttonReset = css`
  appearance: none;
  border: 0;
  outline: none;
  background: transparent;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
`;

const FACTORY_ZONES: FactoryZone[] = [
  {
    id: 'zone-a',
    name: 'A구역',
    floor: '조립동 1F',
    width: 120,
    height: 80,
    coordinateOrigin: 'bottom-left',
    equipments: [
      {
        id: 'ext-a-01',
        name: '소화기-A01',
        x: 24,
        y: 58,
        health: 'normal',
        replacementState: 'stable',
        pressure: '정상',
        installSpot: '입고 동선 입구 우측',
        lastInspection: '2026.02.27 14:18',
        nextReplacement: '2026.09.14',
        note: '출입구와 적재구간 사이 벽체에 고정 설치'
      },
      {
        id: 'ext-a-02',
        name: '소화기-A02',
        x: 95,
        y: 60,
        health: 'normal',
        replacementState: 'stable',
        pressure: '정상',
        installSpot: '패널 박스 전면',
        lastInspection: '2026.02.27 14:22',
        nextReplacement: '2026.08.03',
        note: '패널 전면 1.2m 거리, 접근성 양호'
      },
      {
        id: 'ext-a-03',
        name: '소화기-A03',
        x: 20,
        y: 14,
        health: 'critical',
        replacementState: 'replace-now',
        pressure: '미달',
        installSpot: '서측 비상구 옆',
        lastInspection: '2026.02.27 14:52',
        nextReplacement: '2026.03.10',
        note: '압력 게이지 미달, 즉시 교체 권고'
      }
    ]
  },
  {
    id: 'zone-b',
    name: 'B구역',
    floor: '가공동 1F',
    width: 110,
    height: 78,
    coordinateOrigin: 'bottom-left',
    equipments: [
      {
        id: 'ext-b-01',
        name: '소화기-B01',
        x: 20,
        y: 62,
        health: 'warning',
        replacementState: 'due-soon',
        pressure: '주의',
        installSpot: '절단기 전방',
        lastInspection: '2026.02.28 10:16',
        nextReplacement: '2026.03.12',
        note: '봉인 핀 정상이나 외관 마모 확인'
      },
      {
        id: 'ext-b-02',
        name: '소화기-B02',
        x: 90,
        y: 60,
        health: 'normal',
        replacementState: 'stable',
        pressure: '정상',
        installSpot: '가공 설비 후면 통로',
        lastInspection: '2026.02.28 10:24',
        nextReplacement: '2026.10.01',
        note: '고정 브래킷 및 안내 표식 상태 양호'
      }
    ]
  },
  {
    id: 'zone-c',
    name: 'C구역',
    floor: '검수동 2F',
    width: 118,
    height: 82,
    coordinateOrigin: 'bottom-left',
    equipments: [
      {
        id: 'ext-c-01',
        name: '소화기-C01',
        x: 22,
        y: 18,
        health: 'normal',
        replacementState: 'stable',
        pressure: '정상',
        installSpot: '검수동 진입 계단 앞',
        lastInspection: '2026.02.28 13:40',
        nextReplacement: '2026.07.30',
        note: '동선 시작점에 설치되어 접근성 우수'
      },
      {
        id: 'ext-c-02',
        name: '소화기-C02',
        x: 92,
        y: 18,
        health: 'normal',
        replacementState: 'stable',
        pressure: '정상',
        installSpot: '포장기 측면',
        lastInspection: '2026.02.28 13:48',
        nextReplacement: '2026.09.26',
        note: '포장 공정 종료점 인접'
      },
      {
        id: 'ext-c-03',
        name: '소화기-C03',
        x: 54,
        y: 56,
        health: 'warning',
        replacementState: 'due-soon',
        pressure: '주의',
        installSpot: '중앙 작업대 후면',
        lastInspection: '2026.02.28 16:12',
        nextReplacement: '2026.03.21',
        note: '전면 적치물로 접근 반경 축소'
      }
    ]
  },
  {
    id: 'zone-d',
    name: 'D구역',
    floor: '출하동 1F',
    width: 104,
    height: 74,
    coordinateOrigin: 'bottom-left',
    equipments: [
      {
        id: 'ext-d-01',
        name: '소화기-D01',
        x: 18,
        y: 12,
        health: 'warning',
        replacementState: 'due-soon',
        pressure: '주의',
        installSpot: '하역장 입구 좌측',
        lastInspection: '2026.02.28 14:07',
        nextReplacement: '2026.03.28',
        note: '출하 박스 적재 시 가시성 저하 발생'
      },
      {
        id: 'ext-d-02',
        name: '소화기-D02',
        x: 84,
        y: 54,
        health: 'critical',
        replacementState: 'replace-now',
        pressure: '미달',
        installSpot: '출하 라벨러 옆',
        lastInspection: '2026.02.28 14:35',
        nextReplacement: '2026.03.08',
        note: '압력 저하 및 외관 손상 동시 확인'
      }
    ]
  }
];

const INSPECTION_HISTORY: InspectionRecord[] = [
  {
    id: 'log-1',
    date: '2026.02.28',
    timeRange: '14:00 ~ 15:00',
    level: 'warning',
    zoneId: 'zone-d',
    zoneName: 'D구역',
    equipmentId: 'ext-d-02',
    equipmentName: '소화기-D02',
    inspector: '정하린',
    summary: '출하 라벨러 옆 설비 압력 저하 감지',
    abnormality: '압력 게이지 정상 범위 하단 이탈, 외관 스크래치 동시 확인',
    action: '현장 사용 중지 표시 후 예비 소화기로 대체 배치, 교체 요청 등록',
    detailTitle: '압력 미달 및 외관 손상',
    details: [
      '점검 시 게이지 지침이 허용 범위 최하단 아래로 이동함',
      '브래킷 체결은 유지되었으나 외관에 충격 흔적이 확인됨',
      '출하 장비 동선과 가깝기 때문에 우선 교체 대상으로 지정함'
    ]
  },
  {
    id: 'log-2',
    date: '2026.02.28',
    timeRange: '10:00 ~ 11:00',
    level: 'normal',
    zoneId: 'zone-b',
    zoneName: 'B구역',
    equipmentId: 'ext-b-02',
    equipmentName: '소화기-B02',
    inspector: '박수빈',
    summary: '가공 설비 후면 통로 설비 정상 확인',
    abnormality: '이상 없음',
    action: '현 상태 유지, 다음 정기 점검 일정 반영',
    detailTitle: '정기 점검 정상 완료',
    details: [
      '봉인 핀과 안전 고리가 정상 상태로 유지됨',
      '게이지 압력 정상, 소화기 표기 스티커 식별 상태 양호',
      '작업자 동선과의 간섭 없이 접근 가능'
    ]
  },
  {
    id: 'log-3',
    date: '2026.02.28',
    timeRange: '16:00 ~ 16:30',
    level: 'warning',
    zoneId: 'zone-c',
    zoneName: 'C구역',
    equipmentId: 'ext-c-03',
    equipmentName: '소화기-C03',
    inspector: '이민재',
    summary: '중앙 작업대 후면 적치물로 접근성 저하',
    abnormality: '전면 0.8m 공간 중 일부가 포장 자재로 점유됨',
    action: '적치물 즉시 이동 요청, 교체주기 도래 설비로 함께 관리',
    detailTitle: '접근 반경 확보 필요',
    details: [
      '설비 자체 압력은 정상 범위 안쪽이지만 접근 거리가 기준보다 짧아짐',
      '작업 교대 직후 임시 적치가 반복되어 개선 요청 필요',
      '교체 예정일이 가까워 추적 관리 항목으로 이관'
    ]
  },
  {
    id: 'log-4',
    date: '2026.02.27',
    timeRange: '14:00 ~ 15:00',
    level: 'critical',
    zoneId: 'zone-a',
    zoneName: 'A구역',
    equipmentId: 'ext-a-03',
    equipmentName: '소화기-A03',
    inspector: '김현수',
    summary: '서측 비상구 옆 설비 즉시 교체 필요',
    abnormality: '압력 게이지 미달, 실린더 하단 마모 심화',
    action: '즉시 교체 요청 생성 및 비상구 인접 예비 설비 임시 배치',
    detailTitle: '즉시 교체 대상 설비',
    details: [
      '비상구 동선 인접 설비라 우선순위를 최상위로 지정함',
      '교체 요청 티켓 #FS-2031 자동 생성 완료',
      '교체 전까지 임시 설비 위치를 안내 표지로 고지함'
    ]
  },
  {
    id: 'log-5',
    date: '2026.02.28',
    timeRange: '13:30 ~ 14:00',
    level: 'normal',
    zoneId: 'zone-c',
    zoneName: 'C구역',
    equipmentId: 'ext-c-01',
    equipmentName: '소화기-C01',
    inspector: '최도윤',
    summary: '검수동 진입 계단 앞 설비 정상 유지',
    abnormality: '이상 없음',
    action: '정상 점검 완료 처리',
    detailTitle: '설비 상태 안정',
    details: [
      '안내 표식, 고정 브래킷, 압력 상태 모두 정상',
      '계단 동선 확보 상태 양호',
      '다음 점검 예정: 2026.03.05 오전'
    ]
  },
  {
    id: 'log-6',
    date: '2026.02.28',
    timeRange: '09:30 ~ 10:00',
    level: 'warning',
    zoneId: 'zone-b',
    zoneName: 'B구역',
    equipmentId: 'ext-b-01',
    equipmentName: '소화기-B01',
    inspector: '박수빈',
    summary: '절단기 전방 설비 교체 예정일 임박',
    abnormality: '외관 도장 마모와 사용 안내 스티커 흐림 확인',
    action: '차기 교체주기 대상에 포함, 스티커 재부착 요청',
    detailTitle: '교체주기 도래 예정',
    details: [
      '압력은 정상 범위이나 마킹 식별성이 떨어짐',
      '고온 구간 노출이 반복되어 외관 열화 가속',
      '교체일 전 선제 점검 예약'
    ]
  }
];

const clamp = (value: number, min = 0, max = 1): number => {
  return Math.min(max, Math.max(min, value));
};

const getMarkerTone = (state: ReplacementState | EquipmentHealth): 'green' | 'amber' | 'red' => {
  if (state === 'replace-now' || state === 'critical') {
    return 'red';
  }

  if (state === 'due-soon' || state === 'warning') {
    return 'amber';
  }

  return 'green';
};

const getReplacementLabel = (state: ReplacementState): string => {
  switch (state) {
    case 'stable':
      return '정상';
    case 'due-soon':
      return '교체도래';
    case 'replace-now':
      return '교체필요';
    default:
      return state;
  }
};

const getHealthLabel = (state: EquipmentHealth): string => {
  switch (state) {
    case 'normal':
      return '점검 정상';
    case 'warning':
      return '주의';
    case 'critical':
      return '위험';
    default:
      return state;
  }
};

const getInspectionLevelLabel = (level: InspectionLevel): string => {
  switch (level) {
    case 'normal':
      return '정상';
    case 'warning':
      return '주의';
    case 'critical':
      return '위험';
    default:
      return level;
  }
};

const getInspectionTone = (level: InspectionLevel): 'green' | 'amber' | 'red' => {
  if (level === 'critical') {
    return 'red';
  }

  if (level === 'warning') {
    return 'amber';
  }

  return 'green';
};

const getMarkerPosition = (equipment: FlattenedEquipment): { left: string; top: string } => {
  const xRatio = clamp(equipment.x / equipment.zoneWidth, 0.06, 0.94);
  const rawYRatio = clamp(equipment.y / equipment.zoneHeight, 0.06, 0.94);
  const mappedY = equipment.coordinateOrigin === 'bottom-left' ? 1 - rawYRatio : rawYRatio;

  return {
    left: `${xRatio * 100}%`,
    top: `${clamp(mappedY, 0.06, 0.94) * 100}%`
  };
};

const formatCoordinateOrigin = (origin: CoordinateOrigin): string => {
  return origin === 'bottom-left' ? '좌하단 기준' : '좌상단 기준';
};

const PageShell = styled.main`
  min-height: 100vh;
  min-height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  padding: 24px;
  overflow: hidden;
`;

const AppFrame = styled.div`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 18px;
  height: calc(100vh - 48px);
  height: calc(100dvh - 48px);
  min-height: 0;
`;

const TopBar = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const TitleBlock = styled.div`
  display: grid;
  gap: 8px;
`;

const Eyebrow = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

const MainTitle = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--text-strong);
`;

const Subtitle = styled.p`
  margin: 0;
  max-width: 760px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

const TopStats = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const HeaderPill = styled.div<{ $tone?: 'blue' | 'green' | 'amber' | 'red' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone = 'blue' }) => {
      switch ($tone) {
        case 'green':
          return 'rgba(47, 209, 132, 0.28)';
        case 'amber':
          return 'rgba(255, 190, 87, 0.28)';
        case 'red':
          return 'rgba(255, 105, 119, 0.28)';
        default:
          return 'rgba(91, 156, 255, 0.32)';
      }
    }};
  background:
    ${({ $tone = 'blue' }) => {
      switch ($tone) {
        case 'green':
          return 'rgba(47, 209, 132, 0.12)';
        case 'amber':
          return 'rgba(255, 190, 87, 0.12)';
        case 'red':
          return 'rgba(255, 105, 119, 0.12)';
        default:
          return 'rgba(91, 156, 255, 0.14)';
      }
    }};
  font-size: 13px;
  font-weight: 700;
  color: var(--text-strong);
`;

const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--blue);
  box-shadow: 0 0 16px rgba(91, 156, 255, 0.78);
`;

const DashboardGrid = styled.section`
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr) 360px;
  gap: 18px;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 1400px) {
    grid-template-columns: 280px minmax(0, 1fr) 340px;
  }
`;

const Column = styled.div`
  min-height: 0;
  display: grid;
  gap: 18px;
`;

const LeftColumn = styled(Column)`
  grid-template-rows: auto auto minmax(0, 1fr);
`;

const Panel = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 20px;
  border-radius: 26px;
  border: 1px solid var(--border-soft);
  background:
    linear-gradient(180deg, rgba(13, 24, 46, 0.95) 0%, rgba(10, 18, 36, 0.95) 100%);
  box-shadow:
    var(--shadow-lg),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(14px);
  overflow: hidden;
`;

const CenterPanel = styled(Panel)`
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  gap: 14px;
`;

const RightPanel = styled(Panel)`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 14px;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const PanelTitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-strong);
`;

const PanelCaption = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

const StatusList = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 16px;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const StatusName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
`;

const StatusValue = styled.div<{ $tone: 'green' | 'amber' | 'red' }>`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color:
    ${({ $tone }) => {
      switch ($tone) {
        case 'green':
          return 'var(--green)';
        case 'amber':
          return 'var(--amber)';
        case 'red':
          return 'var(--red)';
        default:
          return 'var(--text-strong)';
      }
    }};
`;

const CardFootnote = styled.div`
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(132, 154, 199, 0.12);
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-muted);
`;

const AlertList = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 16px;
  min-height: 0;
  overflow: auto;
`;

const AlertItem = styled.button<{ $tone: 'amber' | 'red'; $selected: boolean }>`
  ${buttonReset};
  display: grid;
  gap: 6px;
  width: 100%;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid
    ${({ $tone, $selected }) => {
      if ($selected) {
        return $tone === 'red' ? 'rgba(255, 105, 119, 0.34)' : 'rgba(255, 190, 87, 0.34)';
      }

      return $tone === 'red' ? 'rgba(255, 105, 119, 0.18)' : 'rgba(255, 190, 87, 0.18)';
    }};
  background:
    ${({ $tone, $selected }) => {
      if ($tone === 'red') {
        return $selected ? 'rgba(255, 105, 119, 0.14)' : 'rgba(255, 105, 119, 0.08)';
      }

      return $selected ? 'rgba(255, 190, 87, 0.14)' : 'rgba(255, 190, 87, 0.08)';
    }};
  text-align: left;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const AlertTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: var(--text-strong);
`;

const AlertDate = styled.div<{ $tone?: 'amber' | 'red' }>`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: ${({ $tone = 'amber' }) => ($tone === 'red' ? 'var(--red)' : 'var(--amber)')};
`;

const AlertMeta = styled.div`
  font-size: 12px;
  color: var(--text-muted);
`;

const FillerPanel = styled(Panel)`
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
`;

const FillerContent = styled.div`
  display: grid;
  align-content: start;
  gap: 12px;
  margin-top: 16px;
`;

const SmallCard = styled.div`
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.12);
  background: rgba(17, 30, 56, 0.72);
`;

const SmallTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
`;

const SmallText = styled.div`
  margin-top: 6px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.12);
  background: rgba(17, 30, 56, 0.72);
`;

const LegendGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const LegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
`;

const LegendDot = styled.span<{ $tone: 'green' | 'amber' | 'red' }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'green':
          return 'var(--green)';
        case 'amber':
          return 'var(--amber)';
        case 'red':
          return 'var(--red)';
        default:
          return 'var(--blue)';
      }
    }};
  box-shadow:
    ${({ $tone }) => {
      switch ($tone) {
        case 'green':
          return '0 0 12px rgba(47, 209, 132, 0.58)';
        case 'amber':
          return '0 0 12px rgba(255, 190, 87, 0.56)';
        case 'red':
          return '0 0 12px rgba(255, 105, 119, 0.56)';
        default:
          return '0 0 12px rgba(91, 156, 255, 0.56)';
      }
    }};
`;

const LegendMeta = styled.div`
  font-size: 12px;
  color: var(--text-muted);
`;

const ZoneGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
`;

const ZoneCard = styled.div<{ $selected: boolean }>`
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: 10px;
  min-height: 240px;
  padding: 16px;
  border-radius: 22px;
  border: 1px solid ${({ $selected }) => ($selected ? 'rgba(91, 156, 255, 0.32)' : 'rgba(132, 154, 199, 0.12)')};
  background: ${({ $selected }) => ($selected ? 'rgba(18, 35, 67, 0.94)' : 'rgba(14, 26, 49, 0.82)')};
  box-shadow: ${({ $selected }) => ($selected ? '0 18px 40px rgba(0, 0, 0, 0.24)' : 'none')};
`;

const ZoneTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const ZoneTitleGroup = styled.div`
  display: grid;
  gap: 4px;
`;

const ZoneName = styled.div`
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-strong);
`;

const ZoneMeta = styled.div`
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-muted);
`;

const ZoneBadge = styled.div`
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(132, 154, 199, 0.16);
  background: rgba(91, 156, 255, 0.08);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
`;

const MapArea = styled.div`
  position: relative;
  min-height: 0;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.18);
  background:
    linear-gradient(180deg, rgba(12, 22, 40, 0.9) 0%, rgba(8, 16, 31, 0.92) 100%);
  overflow: hidden;
`;

const GridLayer = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right, rgba(132, 154, 199, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(132, 154, 199, 0.08) 1px, transparent 1px);
  background-size: 14.285% 20%;
  opacity: 0.82;
`;

const AxisLabelX = styled.div`
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-muted);
  pointer-events: none;
`;

const AxisLabelY = styled.div`
  position: absolute;
  top: 14px;
  bottom: 26px;
  left: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-muted);
  pointer-events: none;
`;

const AxisCorner = styled.div`
  position: absolute;
  left: 12px;
  bottom: 8px;
  font-size: 10px;
  font-weight: 700;
  color: rgba(245, 248, 255, 0.56);
  pointer-events: none;
`;

const MarkerButton = styled.button<{ $tone: 'green' | 'amber' | 'red'; $selected: boolean }>`
  ${buttonReset};
  position: absolute;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(255, 255, 255, 0.92);
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'green':
          return 'linear-gradient(180deg, #39de92 0%, #1fa363 100%)';
        case 'amber':
          return 'linear-gradient(180deg, #ffc96f 0%, #e29a25 100%)';
        case 'red':
          return 'linear-gradient(180deg, #ff8792 0%, #ea495c 100%)';
        default:
          return 'linear-gradient(180deg, #6eafff 0%, #4c84f7 100%)';
      }
    }};
  box-shadow:
    ${({ $tone, $selected }) => {
      const glow =
        $tone === 'green'
          ? 'rgba(47, 209, 132, 0.42)'
          : $tone === 'amber'
            ? 'rgba(255, 190, 87, 0.42)'
            : 'rgba(255, 105, 119, 0.42)';

      return $selected
        ? `0 0 0 6px rgba(91, 156, 255, 0.18), 0 10px 20px ${glow}`
        : `0 10px 18px ${glow}`;
    }};
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.06);
  }
`;

const MarkerIcon = styled.span`
  position: relative;
  width: 12px;
  height: 14px;

  &::before {
    content: '';
    position: absolute;
    left: 3px;
    top: 3px;
    width: 6px;
    height: 9px;
    border-radius: 2px 2px 3px 3px;
    background: #ffffff;
  }

  &::after {
    content: '';
    position: absolute;
    left: 1px;
    top: 0;
    width: 6px;
    height: 4px;
    border-radius: 6px 6px 0 0;
    border: 2px solid #ffffff;
    border-bottom: 0;
    transform: rotate(-14deg);
    transform-origin: center;
  }
`;

const MarkerTooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  transform: translateX(-50%);
  min-width: 126px;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid rgba(132, 154, 199, 0.18);
  background: rgba(8, 16, 31, 0.96);
  box-shadow: 0 16px 28px rgba(0, 0, 0, 0.28);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: none;
  transition: opacity 140ms ease;
`;

const MarkerTooltipTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: var(--text-strong);
`;

const MarkerTooltipMeta = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: var(--text-muted);
`;

const ZoneFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: var(--text-secondary);
`;

const SelectedEquipmentCard = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(300px, 0.7fr);
  gap: 16px;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(132, 154, 199, 0.12);
  background: rgba(11, 20, 39, 0.82);

  @media (max-width: 1460px) {
    grid-template-columns: 1fr;
  }
`;

const SelectedInfo = styled.div`
  display: grid;
  gap: 14px;
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const InfoTitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const InfoEyebrow = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

const InfoTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-strong);
`;

const StatusBadge = styled.div<{ $tone: 'green' | 'amber' | 'red' }>`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'green':
          return 'rgba(47, 209, 132, 0.26)';
        case 'amber':
          return 'rgba(255, 190, 87, 0.26)';
        case 'red':
          return 'rgba(255, 105, 119, 0.26)';
        default:
          return 'rgba(132, 154, 199, 0.18)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'green':
          return 'rgba(47, 209, 132, 0.12)';
        case 'amber':
          return 'rgba(255, 190, 87, 0.12)';
        case 'red':
          return 'rgba(255, 105, 119, 0.12)';
        default:
          return 'rgba(132, 154, 199, 0.1)';
      }
    }};
  font-size: 12px;
  font-weight: 700;
  color: var(--text-strong);
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 1460px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const MetricCard = styled.div`
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.1);
  background: rgba(16, 28, 53, 0.74);
`;

const MetricLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
`;

const MetricValue = styled.div`
  margin-top: 8px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
`;

const SelectedNote = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.1);
  background: rgba(16, 28, 53, 0.66);
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

const CoordinateHint = styled.div`
  display: grid;
  align-content: start;
  gap: 12px;
`;

const CoordinateCard = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.12);
  background: rgba(16, 28, 53, 0.74);
`;

const CoordinateTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-strong);
`;

const CoordinateText = styled.div`
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

const Formula = styled.code`
  display: block;
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(8, 16, 31, 0.88);
  border: 1px solid rgba(132, 154, 199, 0.12);
  color: #c6d8ff;
  font-size: 12px;
  line-height: 1.7;
  font-family: 'SFMono-Regular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  white-space: pre-wrap;
`;

const InspectionList = styled.div`
  display: grid;
  gap: 12px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
`;

const InspectionCard = styled.div<{ $tone: 'green' | 'amber' | 'red'; $selected: boolean }>`
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid
    ${({ $selected, $tone }) => {
      if ($selected) {
        return $tone === 'red'
          ? 'rgba(255, 105, 119, 0.28)'
          : $tone === 'amber'
            ? 'rgba(255, 190, 87, 0.28)'
            : 'rgba(47, 209, 132, 0.28)';
      }

      return 'rgba(132, 154, 199, 0.12)';
    }};
  background: ${({ $selected }) => ($selected ? 'rgba(18, 35, 67, 0.92)' : 'rgba(15, 28, 53, 0.76)')};
`;

const InspectionTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const InspectionDate = styled.div`
  font-size: 12px;
  line-height: 1.7;
  color: var(--text-muted);
`;

const InspectionSummary = styled.div`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.55;
  color: var(--text-strong);
`;

const InspectionSubtext = styled.div`
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

const InspectionMeta = styled.div`
  font-size: 12px;
  color: var(--text-muted);
`;

const DetailButton = styled.button`
  ${buttonReset};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 190, 87, 0.28);
  background: rgba(255, 190, 87, 0.14);
  color: #ffe38d;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 190, 87, 0.18);
  }
`;

const DrawerBackdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 12, 0.48);
  backdrop-filter: blur(6px);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 180ms ease;
  z-index: 20;
`;

const Drawer = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 24px;
  right: 24px;
  bottom: 24px;
  width: min(460px, calc(100vw - 32px));
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  border-radius: 28px;
  border: 1px solid rgba(132, 154, 199, 0.16);
  background:
    linear-gradient(180deg, rgba(13, 24, 46, 0.97) 0%, rgba(8, 16, 31, 0.98) 100%);
  box-shadow:
    0 32px 72px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transform: translateX(${({ $open }) => ($open ? '0' : '110%')});
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 30;
  overflow: hidden;
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px 18px;
  border-bottom: 1px solid rgba(132, 154, 199, 0.12);
`;

const DrawerHeaderTitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const DrawerEyebrow = styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

const DrawerTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-strong);
`;

const CloseButton = styled.button`
  ${buttonReset};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(132, 154, 199, 0.16);
  background: rgba(16, 28, 53, 0.72);
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
`;

const DrawerBody = styled.div`
  min-height: 0;
  overflow: auto;
  padding: 20px 22px 24px;
  display: grid;
  align-content: start;
  gap: 16px;
`;

const DrawerMetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

const DrawerMetricCard = styled.div`
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.1);
  background: rgba(16, 28, 53, 0.72);
`;

const DrawerMetricLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
`;

const DrawerMetricValue = styled.div`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.6;
  color: var(--text-primary);
`;

const DrawerSection = styled.section`
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.1);
  background: rgba(16, 28, 53, 0.68);
`;

const DrawerSectionTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-strong);
`;

const DrawerSectionText = styled.div`
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
`;

const DrawerList = styled.ul`
  margin: 10px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
`;

const DrawerRelatedCard = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.1);
  background: rgba(9, 18, 33, 0.86);
`;

const RelatedTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: var(--text-strong);
`;

const RelatedText = styled.div`
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
`;

const EmptyDrawer = styled.div`
  display: grid;
  place-items: center;
  min-height: 220px;
  padding: 24px;
  text-align: center;
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
`;

const FireSafetyLayoutDashboard = () => {
  const allEquipments = useMemo<FlattenedEquipment[]>(() => {
    return FACTORY_ZONES.flatMap((zone) =>
      zone.equipments.map((equipment) => ({
        ...equipment,
        zoneId: zone.id,
        zoneName: zone.name,
        zoneFloor: zone.floor,
        zoneWidth: zone.width,
        zoneHeight: zone.height,
        coordinateOrigin: zone.coordinateOrigin
      }))
    );
  }, []);

  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>('ext-a-03');
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null);

  const selectedEquipment = useMemo(() => {
    return allEquipments.find((equipment) => equipment.id === selectedEquipmentId) ?? allEquipments[0];
  }, [allEquipments, selectedEquipmentId]);

  const selectedInspection = useMemo(() => {
    return INSPECTION_HISTORY.find((record) => record.id === selectedInspectionId) ?? null;
  }, [selectedInspectionId]);

  const stableCount = useMemo(() => {
    return allEquipments.filter((equipment) => equipment.replacementState === 'stable').length;
  }, [allEquipments]);

  const replaceNowCount = useMemo(() => {
    return allEquipments.filter((equipment) => equipment.replacementState === 'replace-now').length;
  }, [allEquipments]);

  const dueSoonCount = useMemo(() => {
    return allEquipments.filter((equipment) => equipment.replacementState === 'due-soon').length;
  }, [allEquipments]);

  const alertEquipments = useMemo(() => {
    return allEquipments
      .filter((equipment) => equipment.replacementState !== 'stable')
      .sort((a, b) => a.nextReplacement.localeCompare(b.nextReplacement));
  }, [allEquipments]);

  const relatedInspection = useMemo(() => {
    return INSPECTION_HISTORY.find((record) => record.equipmentId === selectedEquipment.id) ?? null;
  }, [selectedEquipment.id]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedInspectionId(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const openInspection = (record: InspectionRecord) => {
    setSelectedInspectionId(record.id);
    setSelectedEquipmentId(record.equipmentId);
  };

  return (
    <>
      <GlobalStyle />

      <PageShell>
        <AppFrame>
          <TopBar>
            <TitleBlock>
              <Eyebrow>smart factory fire safety board</Eyebrow>
              <MainTitle>소방 설비 점검 대시보드</MainTitle>
              <Subtitle>
                전체 설비 현황, 교체주기 알림, 4개 공장 구역의 좌표 기반 소화기 위치, 실시간 점검 이력을
                한 화면에서 관리할 수 있도록 구성한 다크 테마 페이지입니다.
              </Subtitle>
            </TitleBlock>

            <TopStats>
              <HeaderPill $tone="blue">
                <LiveDot />
                실시간 점검 {INSPECTION_HISTORY.length}건
              </HeaderPill>
              <HeaderPill $tone="green">정상 {stableCount}</HeaderPill>
              <HeaderPill $tone="amber">교체도래 {dueSoonCount}</HeaderPill>
              <HeaderPill $tone="red">교체필요 {replaceNowCount}</HeaderPill>
            </TopStats>
          </TopBar>

          <DashboardGrid>
            <LeftColumn>
              <Panel>
                <PanelHeader>
                  <PanelTitleGroup>
                    <PanelTitle>전체 설비 현황</PanelTitle>
                    <PanelCaption>현재 지도에 표시된 소화기 기준 교체 상태 요약</PanelCaption>
                  </PanelTitleGroup>
                </PanelHeader>

                <StatusList>
                  <StatusRow>
                    <StatusName>정상</StatusName>
                    <StatusValue $tone="green">{stableCount}</StatusValue>
                  </StatusRow>
                  <StatusRow>
                    <StatusName>교체필요</StatusName>
                    <StatusValue $tone="red">{replaceNowCount}</StatusValue>
                  </StatusRow>
                  <StatusRow>
                    <StatusName>교체도래</StatusName>
                    <StatusValue $tone="amber">{dueSoonCount}</StatusValue>
                  </StatusRow>
                </StatusList>

                <CardFootnote>
                  설비 좌표는 구역별 실측 기준 x, y 값으로 저장할 수 있도록 설계했습니다.
                </CardFootnote>
              </Panel>

              <Panel>
                <PanelHeader>
                  <PanelTitleGroup>
                    <PanelTitle>교체 주기 알림</PanelTitle>
                    <PanelCaption>교체일이 임박했거나 즉시 교체가 필요한 설비 목록</PanelCaption>
                  </PanelTitleGroup>
                </PanelHeader>

                <AlertList>
                  {alertEquipments.map((equipment) => {
                    const tone = equipment.replacementState === 'replace-now' ? 'red' : 'amber';

                    return (
                      <AlertItem
                        key={equipment.id}
                        type="button"
                        $tone={tone}
                        $selected={equipment.id === selectedEquipment.id}
                        onClick={() => {
                          setSelectedEquipmentId(equipment.id);
                        }}
                      >
                        <AlertTitle>{equipment.name} 교체 {equipment.replacementState === 'replace-now' ? '필요' : '요망'}</AlertTitle>
                        <AlertDate $tone={tone}>{equipment.nextReplacement}</AlertDate>
                        <AlertMeta>
                          {equipment.zoneName} · {equipment.installSpot}
                        </AlertMeta>
                      </AlertItem>
                    );
                  })}
                </AlertList>
              </Panel>

              <FillerPanel>
                <PanelHeader>
                  <PanelTitleGroup>
                    <PanelTitle>좌표 입력 가이드</PanelTitle>
                    <PanelCaption>실제 x, y 값만 바꿔도 지도상 위치가 자동 반영됩니다.</PanelCaption>
                  </PanelTitleGroup>
                </PanelHeader>

                <FillerContent>
                  <SmallCard>
                    <SmallTitle>데이터 구조</SmallTitle>
                    <SmallText>
                      구역별 width, height와 설비별 x, y를 보관하도록 구성했습니다. 원점 기준은 현재
                      좌하단으로 처리했습니다.
                    </SmallText>
                  </SmallCard>
                  <SmallCard>
                    <SmallTitle>표기 방식</SmallTitle>
                    <SmallText>
                      left = x / width, top = 1 - y / height 계산값으로 마커를 배치합니다. 실제 도면 좌표를
                      그대로 연결하기 좋습니다.
                    </SmallText>
                  </SmallCard>
                </FillerContent>
              </FillerPanel>
            </LeftColumn>

            <CenterPanel>
              <PanelHeader>
                <PanelTitleGroup>
                  <PanelTitle>공장 레이아웃 (소방설비 위치)</PanelTitle>
                  <PanelCaption>
                    4개 구역 지도를 각각 분리하고, 좌표 기반으로 소화기 위치를 표시하도록 구성했습니다.
                  </PanelCaption>
                </PanelTitleGroup>
              </PanelHeader>

              <LegendRow>
                <LegendGroup>
                  <LegendItem>
                    <LegendDot $tone="green" />
                    정상
                  </LegendItem>
                  <LegendItem>
                    <LegendDot $tone="amber" />
                    교체도래
                  </LegendItem>
                  <LegendItem>
                    <LegendDot $tone="red" />
                    교체필요
                  </LegendItem>
                </LegendGroup>

                <LegendMeta>
                  원점 기준: {formatCoordinateOrigin(selectedEquipment.coordinateOrigin)} · 선택 설비 좌표 x {selectedEquipment.x}m / y {selectedEquipment.y}m
                </LegendMeta>
              </LegendRow>

              <ZoneGrid>
                {FACTORY_ZONES.map((zone) => {
                  const zoneEquipments = allEquipments.filter((equipment) => equipment.zoneId === zone.id);
                  const zoneLogs = INSPECTION_HISTORY.filter((record) => record.zoneId === zone.id).length;
                  const isZoneSelected = selectedEquipment.zoneId === zone.id;

                  return (
                    <ZoneCard key={zone.id} $selected={isZoneSelected}>
                      <ZoneTop>
                        <ZoneTitleGroup>
                          <ZoneName>{zone.name}</ZoneName>
                          <ZoneMeta>
                            {zone.floor} · {zone.width}m × {zone.height}m
                          </ZoneMeta>
                        </ZoneTitleGroup>

                        <ZoneBadge>{zoneEquipments.length}대 배치</ZoneBadge>
                      </ZoneTop>

                      <MapArea>
                        <GridLayer />

                        {zoneEquipments.map((equipment) => {
                          const position = getMarkerPosition(equipment);
                          const tone = getMarkerTone(equipment.replacementState);
                          const isSelected = equipment.id === selectedEquipment.id;

                          return (
                            <MarkerButton
                              key={equipment.id}
                              type="button"
                              $tone={tone}
                              $selected={isSelected}
                              style={position}
                              onClick={() => {
                                setSelectedEquipmentId(equipment.id);
                              }}
                            >
                              <MarkerTooltip $visible={isSelected}>
                                <MarkerTooltipTitle>{equipment.name}</MarkerTooltipTitle>
                                <MarkerTooltipMeta>
                                  x {equipment.x}m / y {equipment.y}m
                                </MarkerTooltipMeta>
                              </MarkerTooltip>
                              <MarkerIcon />
                            </MarkerButton>
                          );
                        })}

                        <AxisLabelX>
                          <span>0m</span>
                          <span>{zone.width}m</span>
                        </AxisLabelX>

                        <AxisLabelY>
                          <span>{zone.height}m</span>
                          <span>0m</span>
                        </AxisLabelY>

                        <AxisCorner>(0,0)</AxisCorner>
                      </MapArea>

                      <ZoneFooter>
                        <span>최근 점검 {zoneLogs}건</span>
                        <span>좌표 원점 {formatCoordinateOrigin(zone.coordinateOrigin)}</span>
                      </ZoneFooter>
                    </ZoneCard>
                  );
                })}
              </ZoneGrid>

              <SelectedEquipmentCard>
                <SelectedInfo>
                  <InfoHeader>
                    <InfoTitleGroup>
                      <InfoEyebrow>selected equipment</InfoEyebrow>
                      <InfoTitle>
                        {selectedEquipment.zoneName} · {selectedEquipment.name}
                      </InfoTitle>
                    </InfoTitleGroup>

                    <StatusBadge $tone={getMarkerTone(selectedEquipment.replacementState)}>
                      {getReplacementLabel(selectedEquipment.replacementState)}
                    </StatusBadge>
                  </InfoHeader>

                  <MetricGrid>
                    <MetricCard>
                      <MetricLabel>설치 위치</MetricLabel>
                      <MetricValue>{selectedEquipment.installSpot}</MetricValue>
                    </MetricCard>
                    <MetricCard>
                      <MetricLabel>좌표</MetricLabel>
                      <MetricValue>
                        x {selectedEquipment.x}m · y {selectedEquipment.y}m
                      </MetricValue>
                    </MetricCard>
                    <MetricCard>
                      <MetricLabel>마지막 점검</MetricLabel>
                      <MetricValue>{selectedEquipment.lastInspection}</MetricValue>
                    </MetricCard>
                    <MetricCard>
                      <MetricLabel>압력 상태</MetricLabel>
                      <MetricValue>{selectedEquipment.pressure}</MetricValue>
                    </MetricCard>
                  </MetricGrid>

                  <SelectedNote>
                    {selectedEquipment.note}
                    {relatedInspection ? ` · 최근 점검 메모: ${relatedInspection.summary}` : ''}
                  </SelectedNote>
                </SelectedInfo>

                <CoordinateHint>
                  <CoordinateCard>
                    <CoordinateTitle>좌표 계산 방식</CoordinateTitle>
                    <CoordinateText>
                      실제 공장 도면의 width / height와 설비 좌표 x, y를 넣으면 이 카드처럼 자동 배치되도록
                      만들어뒀습니다.
                    </CoordinateText>
                    <Formula>
                      left = (x / width) * 100{'\n'}
                      top = origin === 'bottom-left' ? (1 - y / height) * 100 : (y / height) * 100
                    </Formula>
                  </CoordinateCard>

                  <CoordinateCard>
                    <CoordinateTitle>연결 가능한 확장 포인트</CoordinateTitle>
                    <CoordinateText>
                      실제 데이터 연동 시 소화전, 감지기, 비상벨 등 다른 설비 타입도 같은 구조로 추가할 수
                      있습니다.
                    </CoordinateText>
                  </CoordinateCard>
                </CoordinateHint>
              </SelectedEquipmentCard>
            </CenterPanel>

            <RightPanel>
              <PanelHeader>
                <PanelTitleGroup>
                  <PanelTitle>실시간 점검 이력</PanelTitle>
                  <PanelCaption>상세 보기 버튼을 누르면 우측 슬라이드 모달로 상세 정보가 열립니다.</PanelCaption>
                </PanelTitleGroup>
              </PanelHeader>

              <InspectionList>
                {INSPECTION_HISTORY.map((record) => {
                  const tone = getInspectionTone(record.level);
                  const isSelected = record.id === selectedInspectionId;

                  return (
                    <InspectionCard key={record.id} $tone={tone} $selected={isSelected}>
                      <InspectionTop>
                        <div>
                          <InspectionDate>
                            일자: {record.date}
                            <br />
                            점검 시간: {record.timeRange}
                          </InspectionDate>
                        </div>

                        <DetailButton
                          type="button"
                          onClick={() => {
                            openInspection(record);
                          }}
                        >
                          상세 보기
                        </DetailButton>
                      </InspectionTop>

                      <InspectionSummary>{record.summary}</InspectionSummary>

                      <InspectionSubtext>
                        이상 여부: {record.abnormality}
                      </InspectionSubtext>

                      <InspectionMeta>
                        {record.zoneName} · {record.equipmentName} · {record.inspector} · {getInspectionLevelLabel(record.level)}
                      </InspectionMeta>
                    </InspectionCard>
                  );
                })}
              </InspectionList>
            </RightPanel>
          </DashboardGrid>
        </AppFrame>
      </PageShell>

      <DrawerBackdrop
        $open={Boolean(selectedInspection)}
        onClick={() => {
          setSelectedInspectionId(null);
        }}
      />

      <Drawer $open={Boolean(selectedInspection)} aria-hidden={!selectedInspection}>
        <DrawerHeader>
          <DrawerHeaderTitleGroup>
            <DrawerEyebrow>inspection detail</DrawerEyebrow>
            <DrawerTitle>실시간 점검 이력 상세</DrawerTitle>
          </DrawerHeaderTitleGroup>

          <CloseButton
            type="button"
            aria-label="상세 닫기"
            onClick={() => {
              setSelectedInspectionId(null);
            }}
          >
            ×
          </CloseButton>
        </DrawerHeader>

        {selectedInspection ? (
          <DrawerBody>
            <StatusBadge $tone={getInspectionTone(selectedInspection.level)}>
              {getInspectionLevelLabel(selectedInspection.level)} · {selectedInspection.detailTitle}
            </StatusBadge>

            <DrawerMetricGrid>
              <DrawerMetricCard>
                <DrawerMetricLabel>점검 일시</DrawerMetricLabel>
                <DrawerMetricValue>
                  {selectedInspection.date}
                  <br />
                  {selectedInspection.timeRange}
                </DrawerMetricValue>
              </DrawerMetricCard>

              <DrawerMetricCard>
                <DrawerMetricLabel>점검자</DrawerMetricLabel>
                <DrawerMetricValue>{selectedInspection.inspector}</DrawerMetricValue>
              </DrawerMetricCard>

              <DrawerMetricCard>
                <DrawerMetricLabel>대상 구역</DrawerMetricLabel>
                <DrawerMetricValue>{selectedInspection.zoneName}</DrawerMetricValue>
              </DrawerMetricCard>

              <DrawerMetricCard>
                <DrawerMetricLabel>설비 ID</DrawerMetricLabel>
                <DrawerMetricValue>{selectedInspection.equipmentName}</DrawerMetricValue>
              </DrawerMetricCard>
            </DrawerMetricGrid>

            <DrawerSection>
              <DrawerSectionTitle>점검 요약</DrawerSectionTitle>
              <DrawerSectionText>{selectedInspection.summary}</DrawerSectionText>
            </DrawerSection>

            <DrawerSection>
              <DrawerSectionTitle>이상 내용</DrawerSectionTitle>
              <DrawerSectionText>{selectedInspection.abnormality}</DrawerSectionText>
            </DrawerSection>

            <DrawerSection>
              <DrawerSectionTitle>조치 사항</DrawerSectionTitle>
              <DrawerSectionText>{selectedInspection.action}</DrawerSectionText>
            </DrawerSection>

            <DrawerSection>
              <DrawerSectionTitle>상세 체크 포인트</DrawerSectionTitle>
              <DrawerList>
                {selectedInspection.details.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </DrawerList>
            </DrawerSection>

            <DrawerRelatedCard>
              <RelatedTitle>연결 설비 정보</RelatedTitle>
              <RelatedText>
                {selectedEquipment.zoneName} · {selectedEquipment.installSpot}
                <br />
                좌표 x {selectedEquipment.x}m / y {selectedEquipment.y}m
                <br />
                압력 상태 {selectedEquipment.pressure} · 교체 상태 {getReplacementLabel(selectedEquipment.replacementState)}
              </RelatedText>
            </DrawerRelatedCard>
          </DrawerBody>
        ) : (
          <EmptyDrawer>
            점검 이력에서 상세 보기 버튼을 누르면
            <br />
            우측 슬라이드 패널에 상세 정보가 표시됩니다.
          </EmptyDrawer>
        )}
      </Drawer>
    </>
  );
};

export default FireSafetyLayoutDashboard;