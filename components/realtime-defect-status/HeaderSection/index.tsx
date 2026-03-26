'use client';

import styled, { css, keyframes } from 'styled-components';
import { formatClock } from '../model/helpers';
import type { SummaryCard } from '../model/types';
import { useState } from 'react';

interface HeaderSectionProps {
  summaryCards: SummaryCard[];
  now: Date;
}

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(86, 212, 255, 0.24);
  }
  70% {
    transform: scale(1.06);
    box-shadow: 0 0 0 12px rgba(86, 212, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(86, 212, 255, 0);
  }
`;

const HeaderSection = ({ summaryCards, now }: HeaderSectionProps) => {
  const incident = summaryCards.find((item) => item.id === 'incident');
  const processing = summaryCards.find((item) => item.id === 'processing');
  const done = summaryCards.find((item) => item.id === 'done');
  const [mounted, setMounted] = useState(false);
  return (
    <Header>
      <TitleBlock>
        <Eyebrow>
          <EyebrowDot /> 실시간 모니터링
        </Eyebrow>
        <PageTitle>실시간 불량 현황</PageTitle>
      </TitleBlock>

      <MetaRow>
        <MetaPill $tone="blue">
        {/* ✨ 마운트 전(서버)에는 고정 텍스트를 보여주고, 마운트 후(클라이언트)에만 실시간 시간을 표시 */}
          실시간 동기화 {mounted ? formatClock(now) : "--:--:--"}
        </MetaPill>
        <MetaPill $tone="red">금일 발생 {incident?.value ?? 0}</MetaPill>
        <MetaPill $tone="blue">처리 중 {processing?.value ?? 0}</MetaPill>
        <MetaPill $tone="green">완료 {done?.value ?? 0}</MetaPill>
      </MetaRow>
    </Header>
  );
};

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

const Eyebrow = styled.div`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(113, 143, 199, 0.16);
  background: rgba(12, 23, 46, 0.74);
  font-size: 13px;
  font-weight: 800;
  color: var(--text-primary);
`;

const EyebrowDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--cyan);
  animation: ${pulse} 2.2s infinite;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: clamp(30px, 3vw, 42px);
  font-weight: 800;
  letter-spacing: -0.05em;
  line-height: 1.08;
`;

const SubText = styled.p`
  margin: 0;
  max-width: 880px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

const MetaPill = styled.div<{ $tone: 'blue' | 'green' | 'red' }>`
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  font-size: 18px;
  font-weight: 800;
  color: var(--text-primary);
  ${({ $tone }) => {
    if ($tone === 'red') {
      return css`
        border: 1px solid rgba(255, 107, 134, 0.22);
        background: rgba(255, 107, 134, 0.1);
      `;
    }

    if ($tone === 'green') {
      return css`
        border: 1px solid rgba(47, 214, 152, 0.22);
        background: rgba(47, 214, 152, 0.1);
      `;
    }

    return css`
      border: 1px solid rgba(79, 143, 255, 0.22);
      background: rgba(79, 143, 255, 0.1);
    `;
  }};
`;

export default HeaderSection;
