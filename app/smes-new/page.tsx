'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

// --- 유틸리티 함수 ---
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

// ==========================================
// 1. 공통 및 레이아웃 스타일
// ==========================================
const DashboardWrapper = styled.div`
  min-height: 100vh;
  background-color: #f4f7fe;
  padding: 32px 40px; /* 전체 여백 확대 */
  font-family: 'Pretendard', sans-serif;
  color: #2b3674;
  box-sizing: border-box;
`;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px; /* 헤더 아래 여백 확대 */
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LogoTitle = styled.h1`
  font-size: 36px; /* 28px -> 36px 대폭 확대 */
  font-weight: 900;
  margin: 0;
  color: #2b3674;
  letter-spacing: -0.5px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 20px; /* 16px -> 20px */
`;

const PillButton = styled.button<{ $primary?: boolean }>`
  appearance: none;
  border: none;
  background-color: ${({ $primary }) => ($primary ? '#4318ff' : '#ffffff')};
  color: ${({ $primary }) => ($primary ? '#ffffff' : '#2b3674')};
  padding: 18px 32px; /* 버튼 패딩 대폭 확대 */
  border-radius: 999px;
  font-size: 20px; /* 16px -> 20px 확대 */
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease-in-out;
  min-width: 140px;
  text-align: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 32px; /* 컬럼 간 간격 확대 */
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px; /* 요소 간 간격 확대 */
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px; /* 요소 간 간격 확대 */
`;

// ==========================================
// 2. 카드 및 내부 컨텐츠 스타일
// ==========================================
const Card = styled.div`
  background-color: #ffffff;
  border-radius: 32px; /* 24px -> 32px (더 둥글게) */
  padding: 40px; /* 32px -> 40px (내부 여백 시원하게 확대) */
  box-shadow: 0px 14px 40px rgba(112, 144, 176, 0.1);
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h2`
  font-size: 28px; /* 20px -> 28px 타이틀 확대 */
  font-weight: 900;
  color: #2b3674;
  margin: 0;
  margin-bottom: 32px; /* 타이틀 아래 여백 확대 */
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px; /* 좌우 간격 넓힘 */
`;

const ProgressItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const ProgressLabel = styled.span`
  font-size: 20px; /* 16px -> 20px */
  font-weight: 700;
  color: #a3aed0;
`;

const ProgressValue = styled.span`
  font-size: 32px; /* 24px -> 32px */
  font-weight: 900;
  color: #2b3674;
`;

const ProgressBarBg = styled.div`
  width: 100%;
  height: 20px; /* 12px -> 20px 프로그레스 바 두께 확대 */
  background-color: #f4f7fe;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ $percent: number; $color: string }>`
  height: 100%;
  width: ${({ $percent }) => `${$percent}%`};
  background-color: ${({ $color }) => $color};
  border-radius: 999px;
  transition: width 1s ease-in-out;
`;

const KpiStatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  height: 100%;
`;

const StatBox = styled.div`
  background-color: #f4f7fe;
  border-radius: 24px;
  padding: 32px 20px; /* 상하 패딩 대폭 확대 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const StatLabel = styled.span`
  font-size: 20px; /* 16px -> 20px */
  font-weight: 800;
  color: #a3aed0;
`;

const StatValue = styled.span`
  font-size: 36px; /* 28px -> 36px 수치 엄청나게 확대 */
  font-weight: 900;
  color: #4318ff;
`;

const QuickMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
`;

const MetricTile = styled.div`
  background-color: #ffffff;
  border-radius: 32px;
  padding: 32px; /* 타일 내부 여백 확대 */
  box-shadow: 0px 14px 40px rgba(112, 144, 176, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
`;

const MetricIconWrapper = styled.div<{ $bgColor: string; $color: string }>`
  width: 80px; /* 56px -> 80px 아이콘 박스 확대 */
  height: 80px;
  border-radius: 24px;
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px; /* 24px -> 40px 아이콘 크기 확대 */
`;

const MetricTextWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MetricTileLabel = styled.span`
  font-size: 22px; /* 16px -> 22px 라벨 확대 */
  font-weight: 700;
  color: #a3aed0;
`;

const MetricTileValue = styled.span`
  font-size: 44px; /* 32px -> 44px 메인 수치 폭풍 확대 */
  font-weight: 900;
  color: #2b3674;
  min-height: 52px;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;

const StatusTile = styled.div<{ $activeBg?: string }>`
  background-color: ${({ $activeBg }) => $activeBg || '#ffffff'};
  border-radius: 24px;
  padding: 32px; /* 패딩 확대 */
  border: 2px solid #e2e8f0; /* 테두리 굵기 1px -> 2px */
  display: flex;
  flex-direction: column;
  gap: 16px; /* 간격 확대 */
`;

const StatusLabel = styled.span`
  font-size: 20px; /* 14px -> 20px */
  font-weight: 800;
  color: #a3aed0;
`;

const StatusValue = styled.span<{ $color?: string }>`
  font-size: 36px; /* 26px -> 36px */
  font-weight: 900;
  color: ${({ $color }) => $color || '#2b3674'};
`;

const PlaceholderBox = styled.div`
  padding: 60px;
  text-align: center;
  background-color: #f4f7fe;
  border-radius: 24px;
  color: #a3aed0;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.5;
`;

// ==========================================
// 메인 대시보드 컴포넌트
// ==========================================
export default function ModernDashboard() {
  const [now, setNow] = useState(() => new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const headerDateTime = useMemo(() => formatHeaderDateTime(now), [now]);
  const updateTime = useMemo(() => formatClock(now), [now]);

  return (
    <DashboardWrapper>
      <HeaderContainer>
        <HeaderLeft>
          <LogoTitle>가진 사출 20호기(2300T)</LogoTitle>
        </HeaderLeft>
        <HeaderRight>
          <PillButton>
            {isMounted ? headerDateTime : '로딩중...'}
          </PillButton>
          <PillButton>Config</PillButton>
          <PillButton>Logout</PillButton>
          <PillButton $primary>+ Update</PillButton>
        </HeaderRight>
      </HeaderContainer>

      <MainContent>
        <LeftColumn>
          <Card>
            <CardTitle>실적 / 달성율 요약</CardTitle>
            <KpiGrid>
              <div>
                <ProgressItem>
                  <ProgressHeader>
                    <ProgressLabel>총 계획 수량</ProgressLabel>
                    <ProgressValue>1,910</ProgressValue>
                  </ProgressHeader>
                  <ProgressBarBg>
                    <ProgressBarFill $percent={100} $color="#4318ff" />
                  </ProgressBarBg>
                </ProgressItem>
                <ProgressItem>
                  <ProgressHeader>
                    <ProgressLabel>현재 이론 수량</ProgressLabel>
                    <ProgressValue>1,142</ProgressValue>
                  </ProgressHeader>
                  <ProgressBarBg>
                    <ProgressBarFill $percent={60} $color="#01b574" />
                  </ProgressBarBg>
                </ProgressItem>
                <ProgressItem>
                  <ProgressHeader>
                    <ProgressLabel>현재 생산 수량</ProgressLabel>
                    <ProgressValue>1,132</ProgressValue>
                  </ProgressHeader>
                  <ProgressBarBg>
                    <ProgressBarFill $percent={59} $color="#ffb547" />
                  </ProgressBarBg>
                </ProgressItem>
              </div>

              <KpiStatGrid>
                <StatBox>
                  <StatLabel>성능 가동률</StatLabel>
                  <StatValue>59.27%</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>시간 가동률</StatLabel>
                  <StatValue>92.58%</StatValue>
                </StatBox>
                <StatBox>
                  <StatLabel>양품률</StatLabel>
                  <StatValue style={{ color: '#01b574' }}>99.12%</StatValue>
                </StatBox>
              </KpiStatGrid>
            </KpiGrid>
          </Card>

          <QuickMetricsGrid>
            <MetricTile>
              <MetricIconWrapper $bgColor="#f4f7fe" $color="#ffb547">
                📊
              </MetricIconWrapper>
              <MetricTextWrap>
                <MetricTileLabel>당일 총실적</MetricTileLabel>
                <MetricTileValue>392</MetricTileValue>
              </MetricTextWrap>
            </MetricTile>
            <MetricTile>
              <MetricIconWrapper $bgColor="#f4f7fe" $color="#4318ff">
                ⏱️
              </MetricIconWrapper>
              <MetricTextWrap>
                <MetricTileLabel>Update Time</MetricTileLabel>
                <MetricTileValue>{isMounted ? updateTime : '--:--:--'}</MetricTileValue>
              </MetricTextWrap>
            </MetricTile>
            <MetricTile>
              <MetricIconWrapper $bgColor="#e6fbd9" $color="#01b574">
                ⏳
              </MetricIconWrapper>
              <MetricTextWrap>
                <MetricTileLabel>Timer</MetricTileLabel>
                <MetricTileValue>01:05</MetricTileValue>
              </MetricTextWrap>
            </MetricTile>
            <MetricTile>
              <MetricIconWrapper $bgColor="#fff4e5" $color="#ff595e">
                ⚙️
              </MetricIconWrapper>
              <MetricTextWrap>
                <MetricTileLabel>Cavity</MetricTileLabel>
                <MetricTileValue>1</MetricTileValue>
              </MetricTextWrap>
            </MetricTile>
          </QuickMetricsGrid>

          <Card style={{ flex: 1 }}>
            <CardTitle>상세 정보 (사출조건표)</CardTitle>
            <PlaceholderBox>
              이곳에 크고 시원한 패딩을 가진 <br/> 둥근 모서리의 테이블이 렌더링 됩니다.
            </PlaceholderBox>
          </Card>
        </LeftColumn>

        <RightColumn>
          <Card>
            <CardTitle>진행중인 계획</CardTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <ProgressHeader>
                <ProgressLabel>품번: HMJT63702703</ProgressLabel>
                <ProgressValue style={{ fontSize: '24px' }}>5 / 8 축</ProgressValue>
              </ProgressHeader>
              <ProgressBarBg>
                <ProgressBarFill $percent={65} $color="#4318ff" />
              </ProgressBarBg>
            </div>
          </Card>

          <Card>
            <CardTitle>실시간 설비 상태</CardTitle>
            <StatusGrid>
              <StatusTile $activeBg="#e6fbd9">
                <StatusLabel>STATE</StatusLabel>
                <StatusValue $color="#01b574">RUN</StatusValue>
              </StatusTile>
              <StatusTile>
                <StatusLabel>READINESS</StatusLabel>
                <StatusValue>Monitor</StatusValue>
              </StatusTile>
              <StatusTile>
                <StatusLabel>ALARM</StatusLabel>
                <StatusValue $color="#a3aed0">None</StatusValue>
              </StatusTile>
              <StatusTile>
                <StatusLabel>RECIPE</StatusLabel>
                <StatusValue>PCS1M</StatusValue>
              </StatusTile>
            </StatusGrid>
          </Card>

          <Card>
            <CardTitle>작업 오더</CardTitle>
            <PlaceholderBox>
              둥글고 여백이 넓은 <br/> 테이블 영역
            </PlaceholderBox>
          </Card>
        </RightColumn>
      </MainContent>
    </DashboardWrapper>
  );
}