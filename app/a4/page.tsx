'use client';

import { useEffect, useMemo, useState } from 'react';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';

type ActionStatus = 'incident' | 'processing' | 'done';
type FilterType = 'all' | ActionStatus;
type DowntimeTone = 'critical' | 'warning' | 'info';

interface LiveSummary {
  incident: number;
  processing: number;
  done: number;
}

interface DowntimeStat {
  id: string;
  name: string;
  downtimeMinutes: number;
  incidents: number;
  availability: number;
  tone: DowntimeTone;
}

interface ActionHistoryItem {
  id: string;
  date: string;
  time: string;
  equipment: string;
  code: string;
  status: ActionStatus;
  area: string;
  title: string;
  summary: string;
  owner: string;
  impact: string;
  startedAt: string;
  updatedAt: string;
}

const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

  :root {
    color-scheme: dark;
    --bg: #050c17;
    --surface-1: rgba(11, 21, 41, 0.96);
    --surface-2: rgba(15, 28, 52, 0.94);
    --surface-3: rgba(18, 34, 62, 0.9);
    --surface-4: rgba(23, 43, 78, 0.8);
    --border-soft: rgba(133, 154, 194, 0.14);
    --border-strong: rgba(91, 156, 255, 0.28);
    --text-strong: #f6f9ff;
    --text-primary: #dce6fb;
    --text-secondary: #9eb2d9;
    --text-muted: #7d93bf;
    --blue: #4f8fff;
    --blue-soft: rgba(79, 143, 255, 0.14);
    --green: #28cf83;
    --green-soft: rgba(40, 207, 131, 0.14);
    --amber: #ffb648;
    --amber-soft: rgba(255, 182, 72, 0.14);
    --red: #ff6373;
    --red-soft: rgba(255, 99, 115, 0.14);
    --shadow-lg: 0 22px 64px rgba(0, 0, 0, 0.34);
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
      radial-gradient(circle at 0% 0%, rgba(58, 96, 168, 0.18) 0%, rgba(58, 96, 168, 0) 30%),
      radial-gradient(circle at 100% 0%, rgba(26, 52, 98, 0.22) 0%, rgba(26, 52, 98, 0) 34%),
      linear-gradient(180deg, #091326 0%, #08101f 40%, #050b16 100%);
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

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(79, 143, 255, 0.18);
  }
  70% {
    transform: scale(1.06);
    box-shadow: 0 0 0 12px rgba(79, 143, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(79, 143, 255, 0);
  }
`;

const LIVE_SUMMARY: LiveSummary = {
  incident: 3,
  processing: 2,
  done: 145
};

const DOWNTIME_STATS: DowntimeStat[] = [
  {
    id: 'facility-a',
    name: '설비A',
    downtimeMinutes: 224,
    incidents: 12,
    availability: 96.1,
    tone: 'critical'
  },
  {
    id: 'facility-b',
    name: '설비B',
    downtimeMinutes: 128,
    incidents: 7,
    availability: 97.8,
    tone: 'warning'
  },
  {
    id: 'facility-c',
    name: '설비C',
    downtimeMinutes: 54,
    incidents: 3,
    availability: 99.2,
    tone: 'info'
  }
];

const ACTION_HISTORY: ActionHistoryItem[] = [
  {
    id: 'act-001',
    date: '2026.03.12',
    time: '10:42',
    equipment: 'M-04',
    code: 'E201',
    status: 'incident',
    area: '압착 2라인',
    title: '유압 압력 급락 감지',
    summary: '유압 센서 값이 임계치 아래로 하락해 자동 알림이 발생했습니다.',
    owner: '김현수',
    impact: '라인 대기 6분',
    startedAt: '2026.03.12 10:37',
    updatedAt: '2026.03.12 10:42'
  },
  {
    id: 'act-002',
    date: '2026.03.12',
    time: '10:40',
    equipment: 'P-12',
    code: 'A105',
    status: 'processing',
    area: '포장 1라인',
    title: '라벨러 센서 재보정 진행',
    summary: '센서 오프셋 보정과 테스트 패스 작업이 진행 중입니다.',
    owner: '박수빈',
    impact: '처리율 18% 저하',
    startedAt: '2026.03.12 10:30',
    updatedAt: '2026.03.12 10:40'
  },
  {
    id: 'act-003',
    date: '2026.03.12',
    time: '09:15',
    equipment: 'M-01',
    code: 'E300',
    status: 'done',
    area: '절단 셀',
    title: '메인 모터 과열 조치 완료',
    summary: '냉각 팬 교체 후 테스트 운전 정상 확인, 생산 재개 처리했습니다.',
    owner: '정하린',
    impact: '정상 복귀',
    startedAt: '2026.03.12 08:49',
    updatedAt: '2026.03.12 09:15'
  },
  {
    id: 'act-004',
    date: '2026.03.12',
    time: '08:50',
    equipment: 'K-09',
    code: 'B002',
    status: 'done',
    area: '혼합 탱크 구역',
    title: '밸브 응답 지연 복구',
    summary: '구동 밸브 재시퀀싱 이후 응답 시간이 기준치 안으로 복귀했습니다.',
    owner: '이민재',
    impact: '정상 복귀',
    startedAt: '2026.03.12 08:33',
    updatedAt: '2026.03.12 08:50'
  },
  {
    id: 'act-005',
    date: '2026.03.12',
    time: '08:30',
    equipment: 'M-04',
    code: 'E201',
    status: 'done',
    area: '압착 2라인',
    title: '초기 진동 이상 조치 완료',
    summary: '체결부 재고정 후 공회전 점검 결과 기준 범위 내로 안정화되었습니다.',
    owner: '최도윤',
    impact: '정상 복귀',
    startedAt: '2026.03.12 08:11',
    updatedAt: '2026.03.12 08:30'
  },
  {
    id: 'act-006',
    date: '2026.03.12',
    time: '08:05',
    equipment: 'A-22',
    code: 'F404',
    status: 'incident',
    area: '검수 라인',
    title: '비전 카메라 프레임 드랍 발생',
    summary: '카메라 통신 지연으로 검사 이미지 유실이 감지되었습니다.',
    owner: '김현수',
    impact: '검사 지연 4분',
    startedAt: '2026.03.12 08:02',
    updatedAt: '2026.03.12 08:05'
  },
  {
    id: 'act-007',
    date: '2026.03.12',
    time: '07:44',
    equipment: 'L-18',
    code: 'C118',
    status: 'processing',
    area: '출하 대기존',
    title: '컨베이어 정렬 보정 진행',
    summary: '트래킹 센서 재보정과 시운전 작업이 동시에 진행 중입니다.',
    owner: '박수빈',
    impact: '출하 순번 지연',
    startedAt: '2026.03.12 07:35',
    updatedAt: '2026.03.12 07:44'
  },
  {
    id: 'act-008',
    date: '2026.03.12',
    time: '07:22',
    equipment: 'Q-07',
    code: 'H207',
    status: 'done',
    area: '정밀 가공실',
    title: '스핀들 축 정렬 완료',
    summary: '축 정렬과 런아웃 검증을 마친 뒤 설비를 운영 상태로 복귀했습니다.',
    owner: '정하린',
    impact: '정상 복귀',
    startedAt: '2026.03.12 06:58',
    updatedAt: '2026.03.12 07:22'
  },
  {
    id: 'act-009',
    date: '2026.03.11',
    time: '18:48',
    equipment: 'P-06',
    code: 'D110',
    status: 'done',
    area: '포장 2라인',
    title: '프린터 헤드 청소 완료',
    summary: '헤드 막힘 제거 후 테스트 패턴 출력 정상 확인했습니다.',
    owner: '최도윤',
    impact: '정상 복귀',
    startedAt: '2026.03.11 18:31',
    updatedAt: '2026.03.11 18:48'
  },
  {
    id: 'act-010',
    date: '2026.03.11',
    time: '17:20',
    equipment: 'M-09',
    code: 'E112',
    status: 'done',
    area: '가공 3셀',
    title: '쿨런트 유량 이상 조치 완료',
    summary: '필터 교체 후 유량 센서 값이 정상 범위로 회복되었습니다.',
    owner: '이민재',
    impact: '정상 복귀',
    startedAt: '2026.03.11 17:01',
    updatedAt: '2026.03.11 17:20'
  },
  {
    id: 'act-011',
    date: '2026.03.11',
    time: '15:54',
    equipment: 'R-14',
    code: 'G317',
    status: 'incident',
    area: '자재 이송로',
    title: '포크 센서 미검출 발생',
    summary: '물류 포크 위치 검출이 누락되어 이송 정지 알림이 생성되었습니다.',
    owner: '김현수',
    impact: '이송 대기 3분',
    startedAt: '2026.03.11 15:51',
    updatedAt: '2026.03.11 15:54'
  },
  {
    id: 'act-012',
    date: '2026.03.11',
    time: '14:12',
    equipment: 'B-03',
    code: 'A210',
    status: 'done',
    area: '배합실',
    title: '투입 게이트 작동 오류 복구',
    summary: '실린더 압력 재설정 후 투입 게이트 개폐 동작이 정상화되었습니다.',
    owner: '정하린',
    impact: '정상 복귀',
    startedAt: '2026.03.11 13:55',
    updatedAt: '2026.03.11 14:12'
  }
];

const getStatusLabel = (status: ActionStatus): string => {
  switch (status) {
    case 'incident':
      return '발생';
    case 'processing':
      return '조치중';
    case 'done':
      return '완료';
    default:
      return status;
  }
};

const getStatusDescription = (status: ActionStatus): string => {
  switch (status) {
    case 'incident':
      return '즉시 확인 필요';
    case 'processing':
      return '현장 조치 진행';
    case 'done':
      return '정상 운영 복귀';
    default:
      return status;
  }
};

const getStatusTone = (status: ActionStatus): string => {
  switch (status) {
    case 'incident':
      return 'var(--red)';
    case 'processing':
      return 'var(--blue)';
    case 'done':
      return 'var(--green)';
    default:
      return 'var(--text-primary)';
  }
};

const formatMinutes = (minutes: number): string => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  if (hour === 0) {
    return `${minute}분`;
  }

  return `${hour}시간 ${String(minute).padStart(2, '0')}분`;
};

const formatClock = (date: Date): string => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

const PageShell = styled.main`
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  padding: 28px;
  background:
    radial-gradient(circle at 0% 0%, rgba(58, 96, 168, 0.18) 0%, rgba(58, 96, 168, 0) 30%),
    radial-gradient(circle at 100% 0%, rgba(26, 52, 98, 0.24) 0%, rgba(26, 52, 98, 0) 34%),
    linear-gradient(180deg, #091326 0%, #08101f 40%, #050b16 100%);
`;

const Frame = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 20px;
  min-height: 0;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const TitleBlock = styled.div`
  display: grid;
  gap: 10px;
`;

const TitleBadge = styled.div`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(133, 154, 194, 0.18);
  background: rgba(17, 31, 58, 0.88);
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

const TitleDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--blue);
  animation: ${pulse} 2.2s infinite;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.04em;
`;

const SubText = styled.p`
  margin: 0;
  max-width: 760px;
  font-size: 14px;
  line-height: 1.75;
  color: var(--text-secondary);
`;

const HeaderMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const MetaPill = styled.div<{ $tone?: 'neutral' | 'blue' | 'green' | 'red' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone = 'neutral' }) => {
      switch ($tone) {
        case 'blue':
          return 'rgba(79, 143, 255, 0.26)';
        case 'green':
          return 'rgba(40, 207, 131, 0.24)';
        case 'red':
          return 'rgba(255, 99, 115, 0.24)';
        default:
          return 'rgba(133, 154, 194, 0.18)';
      }
    }};
  background:
    ${({ $tone = 'neutral' }) => {
      switch ($tone) {
        case 'blue':
          return 'rgba(79, 143, 255, 0.12)';
        case 'green':
          return 'rgba(40, 207, 131, 0.12)';
        case 'red':
          return 'rgba(255, 99, 115, 0.12)';
        default:
          return 'rgba(16, 28, 53, 0.82)';
      }
    }};
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
`;

const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--green);
  box-shadow: 0 0 18px rgba(40, 207, 131, 0.7);
`;

const DashboardGrid = styled.section`
  min-height: 0;
  height: 100%;
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 20px;
  overflow: hidden;

  @media (max-width: 1280px) {
    grid-template-columns: 320px minmax(0, 1fr);
  }
`;

const LeftColumn = styled.div`
  min-height: 0;
  display: grid;
  grid-template-rows: auto auto;
  gap: 20px;
  overflow: hidden;
`;

const Panel = styled.section`
  min-height: 0;
  padding: 22px;
  border-radius: 26px;
  border: 1px solid rgba(133, 154, 194, 0.14);
  background: linear-gradient(180deg, rgba(13, 24, 46, 0.95) 0%, rgba(10, 18, 36, 0.95) 100%);
  box-shadow:
    0 18px 58px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
`;

const RightPanel = styled(Panel)`
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr);
  gap: 16px;
  overflow: hidden;
`;

const PanelHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
`;

const PanelTitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 23px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

const PanelCaption = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

const TinyPill = styled.div<{ $tone?: 'neutral' | 'red' | 'blue' | 'green' | 'amber' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone = 'neutral' }) => {
      switch ($tone) {
        case 'red':
          return 'rgba(255, 99, 115, 0.24)';
        case 'blue':
          return 'rgba(79, 143, 255, 0.24)';
        case 'green':
          return 'rgba(40, 207, 131, 0.24)';
        case 'amber':
          return 'rgba(255, 182, 72, 0.24)';
        default:
          return 'rgba(133, 154, 194, 0.18)';
      }
    }};
  background:
    ${({ $tone = 'neutral' }) => {
      switch ($tone) {
        case 'red':
          return 'rgba(255, 99, 115, 0.1)';
        case 'blue':
          return 'rgba(79, 143, 255, 0.1)';
        case 'green':
          return 'rgba(40, 207, 131, 0.1)';
        case 'amber':
          return 'rgba(255, 182, 72, 0.1)';
        default:
          return 'rgba(16, 28, 53, 0.72)';
      }
    }};
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
`;

const StatusSummaryCard = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0;
  margin-top: 18px;
  border-radius: 22px;
  border: 1px solid rgba(133, 154, 194, 0.12);
  background: rgba(14, 26, 49, 0.86);
  overflow: hidden;
`;

const StatusBlock = styled.div<{ $tone: 'red' | 'blue' | 'green' }>`
  position: relative;
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 24px 18px;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 16px;
    right: 0;
    bottom: 16px;
    width: 1px;
    background: rgba(133, 154, 194, 0.12);
  }
`;

const StatusValue = styled.div<{ $tone: 'red' | 'blue' | 'green' }>`
  font-size: 42px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.05em;
  color:
    ${({ $tone }) => {
      switch ($tone) {
        case 'red':
          return 'var(--red)';
        case 'blue':
          return 'var(--blue)';
        case 'green':
          return 'var(--green)';
        default:
          return 'var(--text-primary)';
      }
    }};
`;

const StatusLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
`;

const StatusHint = styled.div`
  font-size: 11px;
  color: var(--text-muted);
`;

const DowntimeStack = styled.div`
  display: grid;
  gap: 18px;
  margin-top: 18px;
`;

const DowntimeRow = styled.div`
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
`;

const DowntimeLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
`;

const ProgressTrack = styled.div`
  position: relative;
  height: 14px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(125, 145, 184, 0.14);
  border: 1px solid rgba(133, 154, 194, 0.08);
`;

const ProgressFill = styled.div<{ $width: number; $tone: DowntimeTone }>`
  width: ${({ $width }) => `${$width}%`};
  height: 100%;
  border-radius: 999px;
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'critical':
          return 'linear-gradient(90deg, rgba(255, 99, 115, 0.86) 0%, rgba(255, 99, 115, 1) 100%)';
        case 'warning':
          return 'linear-gradient(90deg, rgba(255, 182, 72, 0.86) 0%, rgba(255, 182, 72, 1) 100%)';
        case 'info':
          return 'linear-gradient(90deg, rgba(79, 143, 255, 0.86) 0%, rgba(79, 143, 255, 1) 100%)';
        default:
          return 'linear-gradient(90deg, rgba(79, 143, 255, 0.86) 0%, rgba(79, 143, 255, 1) 100%)';
      }
    }};
  box-shadow:
    ${({ $tone }) => {
      switch ($tone) {
        case 'critical':
          return '0 0 18px rgba(255, 99, 115, 0.36)';
        case 'warning':
          return '0 0 18px rgba(255, 182, 72, 0.36)';
        case 'info':
          return '0 0 18px rgba(79, 143, 255, 0.32)';
        default:
          return 'none';
      }
    }};
`;

const DowntimeMeta = styled.div`
  display: grid;
  justify-items: end;
  gap: 4px;
`;

const DowntimeValue = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
`;

const DowntimeSubValue = styled.div`
  font-size: 11px;
  color: var(--text-muted);
`;

const DowntimeFoot = styled.div`
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(133, 154, 194, 0.12);
`;

const FocusCard = styled.div`
  display: grid;
  gap: 10px;
  padding: 16px 18px;
  border-radius: 20px;
  border: 1px solid rgba(133, 154, 194, 0.12);
  background: rgba(16, 28, 53, 0.82);
`;

const FocusHeadline = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const FocusTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

const FocusSummary = styled.div`
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

const FocusMetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
`;

const FocusMetric = styled.div`
  padding: 14px;
  border-radius: 16px;
  border: 1px solid rgba(133, 154, 194, 0.1);
  background: rgba(18, 34, 62, 0.82);
`;

const FocusMetricLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
`;

const FocusMetricValue = styled.div`
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.6;
  font-weight: 700;
  color: var(--text-primary);
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  ${buttonReset};
  min-height: 36px;
  padding: 0 13px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(79, 143, 255, 0.34)' : 'rgba(133, 154, 194, 0.16)')};
  background: ${({ $active }) => ($active ? 'rgba(79, 143, 255, 0.12)' : 'rgba(16, 28, 53, 0.76)')};
  font-size: 12px;
  font-weight: 700;
  color: var(--text-primary);
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    background 150ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const TableFrame = styled.div`
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 10px;
  overflow: hidden;
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 88px 92px 92px minmax(90px, 1fr);
  gap: 12px;
  padding: 0 14px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 700;
`;

const TableScroll = styled.div`
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
`;

const TableList = styled.div`
  display: grid;
  gap: 10px;
`;

const TableRow = styled.button<{ $active: boolean }>`
  ${buttonReset};
  width: 100%;
  display: grid;
  grid-template-columns: 88px 92px 92px minmax(90px, 1fr);
  gap: 12px;
  align-items: center;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid ${({ $active }) => ($active ? 'rgba(79, 143, 255, 0.32)' : 'rgba(133, 154, 194, 0.12)')};
  background: ${({ $active }) => ($active ? 'rgba(18, 35, 67, 0.92)' : 'rgba(15, 28, 53, 0.72)')};
  text-align: left;
  transition:
    transform 150ms ease,
    border-color 150ms ease,
    background 150ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const CellText = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
`;

const StatusBadge = styled.div<{ $status: ActionStatus }>`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $status }) => {
      switch ($status) {
        case 'incident':
          return 'rgba(255, 99, 115, 0.26)';
        case 'processing':
          return 'rgba(79, 143, 255, 0.26)';
        case 'done':
          return 'rgba(40, 207, 131, 0.26)';
        default:
          return 'rgba(133, 154, 194, 0.18)';
      }
    }};
  background:
    ${({ $status }) => {
      switch ($status) {
        case 'incident':
          return 'rgba(255, 99, 115, 0.1)';
        case 'processing':
          return 'rgba(79, 143, 255, 0.1)';
        case 'done':
          return 'rgba(40, 207, 131, 0.1)';
        default:
          return 'rgba(16, 28, 53, 0.72)';
      }
    }};
  font-size: 12px;
  font-weight: 700;
  color: ${({ $status }) => getStatusTone($status)};
`;

const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 240px;
  padding: 20px;
  border-radius: 18px;
  border: 1px dashed rgba(133, 154, 194, 0.16);
  background: rgba(15, 28, 53, 0.56);
  text-align: center;
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
`;

const EquipmentActionDashboard = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedId, setSelectedId] = useState<string>(ACTION_HISTORY[0]?.id ?? '');
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const maxDowntime = useMemo(() => {
    return Math.max(...DOWNTIME_STATS.map((item) => item.downtimeMinutes));
  }, []);

  const visibleHistory = useMemo(() => {
    if (filter === 'all') {
      return ACTION_HISTORY;
    }

    return ACTION_HISTORY.filter((item) => item.status === filter);
  }, [filter]);

  const selectedHistory = useMemo(() => {
    return visibleHistory.find((item) => item.id === selectedId) ?? visibleHistory[0] ?? ACTION_HISTORY[0];
  }, [selectedId, visibleHistory]);

  useEffect(() => {
    if (!visibleHistory.some((item) => item.id === selectedId) && visibleHistory[0]) {
      setSelectedId(visibleHistory[0].id);
    }
  }, [selectedId, visibleHistory]);

  const topDowntime = useMemo(() => {
    return DOWNTIME_STATS.reduce((prev, current) => {
      return current.downtimeMinutes > prev.downtimeMinutes ? current : prev;
    }, DOWNTIME_STATS[0]);
  }, []);

  const averageAvailability = useMemo(() => {
    const total = DOWNTIME_STATS.reduce((sum, item) => sum + item.availability, 0);

    return (total / DOWNTIME_STATS.length).toFixed(1);
  }, []);

  return (
    <>
      <GlobalStyle />

      <PageShell>
        <Frame>
          <Header>
            <TitleBlock>
              <TitleBadge>
                <TitleDot /> 설비 관리
              </TitleBadge>
              <PageTitle>무작업 조치 대시보드</PageTitle>
              <SubText>
                설비 이상 발생 현황, 설비별 다운타임 추이, 최근 조치 이력을 한 화면에서 빠르게 확인하는 운영 패널입니다.
                전체 높이는 100vh 안에 고정하고, 넘치는 데이터는 패널 내부에서만 스크롤되도록 구성했습니다.
              </SubText>
            </TitleBlock>

            <HeaderMeta>
              <MetaPill $tone="blue">총 이력 {ACTION_HISTORY.length}건</MetaPill>
              <MetaPill>
                <LiveDot /> 실시간 동기화 {formatClock(now)}
              </MetaPill>
              <MetaPill $tone="green">오늘 완료 {LIVE_SUMMARY.done}</MetaPill>
            </HeaderMeta>
          </Header>

          <DashboardGrid>
            <LeftColumn>
              <Panel>
                <PanelHead>
                  <PanelTitleGroup>
                    <PanelTitle>실시간 무작업 현황</PanelTitle>
                    <PanelCaption>현재 운영 화면 기준으로 즉시 확인이 필요한 항목과 진행 중인 항목을 분리해 보여줍니다.</PanelCaption>
                  </PanelTitleGroup>
                  <TinyPill $tone="blue">현재 교대 1조</TinyPill>
                </PanelHead>

                <StatusSummaryCard>
                  <StatusBlock $tone="red">
                    <StatusValue $tone="red">{LIVE_SUMMARY.incident}</StatusValue>
                    <StatusLabel>발생</StatusLabel>
                    <StatusHint>즉시 확인 필요</StatusHint>
                  </StatusBlock>

                  <StatusBlock $tone="blue">
                    <StatusValue $tone="blue">{LIVE_SUMMARY.processing}</StatusValue>
                    <StatusLabel>조치중</StatusLabel>
                    <StatusHint>현장 조치 진행</StatusHint>
                  </StatusBlock>

                  <StatusBlock $tone="green">
                    <StatusValue $tone="green">{LIVE_SUMMARY.done}</StatusValue>
                    <StatusLabel>완료</StatusLabel>
                    <StatusHint>정상 운영 복귀</StatusHint>
                  </StatusBlock>
                </StatusSummaryCard>
              </Panel>

              <Panel>
                <PanelHead>
                  <PanelTitleGroup>
                    <PanelTitle>설비별 다운타임 통계</PanelTitle>
                    <PanelCaption>최근 7일 누적 다운타임 기준으로 설비별 위험도를 빠르게 비교할 수 있습니다.</PanelCaption>
                  </PanelTitleGroup>
                  <TinyPill $tone="amber">집중 관리 {topDowntime.name}</TinyPill>
                </PanelHead>

                <DowntimeStack>
                  {DOWNTIME_STATS.map((item) => (
                    <DowntimeRow key={item.id}>
                      <DowntimeLabel>{item.name}</DowntimeLabel>

                      <ProgressTrack>
                        <ProgressFill
                          $width={(item.downtimeMinutes / maxDowntime) * 100}
                          $tone={item.tone}
                        />
                      </ProgressTrack>

                      <DowntimeMeta>
                        <DowntimeValue>{formatMinutes(item.downtimeMinutes)}</DowntimeValue>
                        <DowntimeSubValue>장애 {item.incidents}건</DowntimeSubValue>
                      </DowntimeMeta>
                    </DowntimeRow>
                  ))}
                </DowntimeStack>

                <DowntimeFoot>
                  <TinyPill $tone="red">가장 긴 중단 {topDowntime.name}</TinyPill>
                  <PanelCaption>평균 가동률 {averageAvailability}%</PanelCaption>
                </DowntimeFoot>
              </Panel>
            </LeftColumn>

            <RightPanel>
              <PanelHead>
                <PanelTitleGroup>
                  <PanelTitle>무작업 조치 이력</PanelTitle>
                  <PanelCaption>행을 선택하면 상단 포커스 카드에 설비 위치, 담당자, 영향 범위를 더 크게 보여줍니다.</PanelCaption>
                </PanelTitleGroup>
                <TinyPill $tone="green">선택 설비 {selectedHistory?.equipment}</TinyPill>
              </PanelHead>

              {selectedHistory && (
                <FocusCard>
                  <FocusHeadline>
                    <FocusTitle>
                      {selectedHistory.equipment} · {selectedHistory.code} · {selectedHistory.title}
                    </FocusTitle>
                    <StatusBadge $status={selectedHistory.status}>{getStatusLabel(selectedHistory.status)}</StatusBadge>
                  </FocusHeadline>

                  <FocusSummary>{selectedHistory.summary}</FocusSummary>

                  <FocusMetaGrid>
                    <FocusMetric>
                      <FocusMetricLabel>상태</FocusMetricLabel>
                      <FocusMetricValue>{getStatusDescription(selectedHistory.status)}</FocusMetricValue>
                    </FocusMetric>

                    <FocusMetric>
                      <FocusMetricLabel>설비 위치</FocusMetricLabel>
                      <FocusMetricValue>{selectedHistory.area}</FocusMetricValue>
                    </FocusMetric>

                    <FocusMetric>
                      <FocusMetricLabel>담당자</FocusMetricLabel>
                      <FocusMetricValue>{selectedHistory.owner}</FocusMetricValue>
                    </FocusMetric>

                    <FocusMetric>
                      <FocusMetricLabel>영향</FocusMetricLabel>
                      <FocusMetricValue>{selectedHistory.impact}</FocusMetricValue>
                    </FocusMetric>
                  </FocusMetaGrid>
                </FocusCard>
              )}

              <FilterRow>
                <FilterGroup>
                  <FilterButton
                    type="button"
                    $active={filter === 'all'}
                    onClick={() => {
                      setFilter('all');
                    }}
                  >
                    전체
                  </FilterButton>
                  <FilterButton
                    type="button"
                    $active={filter === 'incident'}
                    onClick={() => {
                      setFilter('incident');
                    }}
                  >
                    발생
                  </FilterButton>
                  <FilterButton
                    type="button"
                    $active={filter === 'processing'}
                    onClick={() => {
                      setFilter('processing');
                    }}
                  >
                    조치중
                  </FilterButton>
                  <FilterButton
                    type="button"
                    $active={filter === 'done'}
                    onClick={() => {
                      setFilter('done');
                    }}
                  >
                    완료
                  </FilterButton>
                </FilterGroup>

                <TinyPill>{filter === 'all' ? '전체 이력' : `${getStatusLabel(filter)} 이력`} {visibleHistory.length}건</TinyPill>
              </FilterRow>

              <TableFrame>
                <TableHead>
                  <div>시간</div>
                  <div>설비</div>
                  <div>코드</div>
                  <div>상태</div>
                </TableHead>

                <TableScroll>
                  {visibleHistory.length === 0 ? (
                    <EmptyState>
                      선택한 조건에 맞는 조치 이력이 없습니다.
                      <br />
                      필터를 변경해서 다른 상태의 이력을 확인해보세요.
                    </EmptyState>
                  ) : (
                    <TableList>
                      {visibleHistory.map((item) => (
                        <TableRow
                          key={item.id}
                          type="button"
                          $active={item.id === selectedHistory?.id}
                          onClick={() => {
                            setSelectedId(item.id);
                          }}
                        >
                          <CellText>{item.time}</CellText>
                          <CellText>{item.equipment}</CellText>
                          <CellText>{item.code}</CellText>
                          <StatusBadge $status={item.status}>{getStatusLabel(item.status)}</StatusBadge>
                        </TableRow>
                      ))}
                    </TableList>
                  )}
                </TableScroll>
              </TableFrame>
            </RightPanel>
          </DashboardGrid>
        </Frame>
      </PageShell>
    </>
  );
};

export default EquipmentActionDashboard;
