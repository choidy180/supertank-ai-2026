'use client';

import styled, { css, keyframes } from 'styled-components';
import { formatClock } from '../model/helpers';
import type { SummaryCard } from '../model/types';
import { useState, useEffect } from 'react';

// ✨ isDark 프롭스 추가
interface HeaderSectionProps {
  summaryCards: SummaryCard[];
  now: Date;
  isDark: boolean; 
}

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.3);
  }
  70% {
    transform: scale(1.06);
    box-shadow: 0 0 0 10px rgba(0, 122, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 122, 255, 0);
  }
`;

const HeaderSection = ({ summaryCards, now, isDark }: HeaderSectionProps) => {
  const [mounted, setMounted] = useState(false);

  // ✨ 클라이언트 마운트 후 상태 변경 로직 추가
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Header>
      <TitleBlock>
        <PageTitle $isDark={isDark}>실시간 불량 현황</PageTitle>
      </TitleBlock>

      <MetaRow>
        <MetaPill $tone="blue" $isDark={isDark}>
          <DotIndicator />
          {/* 마운트 전(서버)에는 고정 텍스트를 보여주고, 마운트 후(클라이언트)에만 실시간 시간을 표시 */}
          실시간 동기화 {mounted ? formatClock(now) : "--:--:--"}
        </MetaPill>
      </MetaRow>
    </Header>
  );
};

// --- Styled Components ---

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;

  @media (max-width: 1120px) {
    flex-direction: column;
  }
`;

const TitleBlock = styled.div`
  display: grid;
  gap: 12px;
`;

// 참고: 현재 JSX에는 없지만 기존 코드에 있던 스타일들도 테마에 맞게 유지/수정했습니다.
const Eyebrow = styled.div<{ $isDark: boolean }>`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)')};
  background: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff')};
  font-size: 13px;
  font-weight: 700;
  color: ${({ $isDark }) => ($isDark ? '#f5f5f7' : '#1d1d1f')};
  transition: all 0.3s ease;
`;

const PageTitle = styled.h1<{ $isDark: boolean }>`
  margin: 0;
  font-size: clamp(28px, 3vw, 38px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: ${({ $isDark }) => ($isDark ? '#f5f5f7' : '#1d1d1f')};
  transition: color 0.3s ease;
`;

const SubText = styled.p<{ $isDark: boolean }>`
  margin: 0;
  max-width: 880px;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ $isDark }) => ($isDark ? '#a1a1a6' : '#86868b')};
  transition: color 0.3s ease;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

const DotIndicator = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #007aff;
  margin-right: 8px;
  animation: ${pulse} 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
`;

const getPillStyle = ($tone: 'blue' | 'green' | 'red', $isDark: boolean) => {
  if ($tone === 'red') {
    return css`
      border: 1px solid ${$isDark ? 'rgba(255, 69, 58, 0.2)' : 'rgba(255, 59, 48, 0.2)'};
      background: ${$isDark ? 'rgba(255, 69, 58, 0.1)' : 'rgba(255, 59, 48, 0.08)'};
      color: ${$isDark ? '#ff453a' : '#ff3b30'};
    `;
  }

  if ($tone === 'green') {
    return css`
      border: 1px solid ${$isDark ? 'rgba(48, 209, 88, 0.2)' : 'rgba(52, 199, 89, 0.2)'};
      background: ${$isDark ? 'rgba(48, 209, 88, 0.1)' : 'rgba(52, 199, 89, 0.08)'};
      color: ${$isDark ? '#30d158' : '#34c759'};
    `;
  }

  // Default (Blue)
  return css`
    border: 1px solid ${$isDark ? 'rgba(10, 132, 255, 0.2)' : 'rgba(0, 122, 255, 0.2)'};
    background: ${$isDark ? 'rgba(10, 132, 255, 0.1)' : 'rgba(0, 122, 255, 0.08)'};
    color: ${$isDark ? '#5ac8fa' : '#007aff'};
  `;
};

const MetaPill = styled.div<{ $tone: 'blue' | 'green' | 'red'; $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.02em;
  transition: all 0.3s ease;
  
  /* 분리한 스타일 함수 적용 */
  ${({ $tone, $isDark }) => getPillStyle($tone, $isDark)}
`;

export default HeaderSection;