'use client';

import styled, { css } from 'styled-components';
import type { SummaryCard, SummaryTone } from '../model/types';

interface StatusCardProps {
  card: SummaryCard;
  isDark: boolean;
}

const StatusCard = ({ card, isDark }: StatusCardProps) => {
  return (
    <Card $isDark={isDark}>
      <CardHeader>
        <CardLabel $isDark={isDark}>{card.label}</CardLabel>
        <IconBubble $tone={card.tone} $isDark={isDark}>{card.icon}</IconBubble>
      </CardHeader>

      <CardValue $isDark={isDark}>{card.value}</CardValue>
      <CardCaption $isDark={isDark}>{card.caption}</CardCaption>
    </Card>
  );
};

// --- Styled Components Helper Functions ---

// 아이콘 버블 색상 (그라데이션 없이 깔끔한 단색 배경)
const getIconBubbleStyle = ($tone: SummaryTone, $isDark: boolean) => {
  let colorHex = '';
  let colorRgb = '';

  switch ($tone) {
    case 'incident':
      colorHex = $isDark ? '#ff453a' : '#ff3b30';
      colorRgb = $isDark ? '255, 69, 58' : '255, 59, 48';
      break;
    case 'processing':
      colorHex = $isDark ? '#0a84ff' : '#007aff';
      colorRgb = $isDark ? '10, 132, 255' : '0, 122, 255';
      break;
    case 'done':
      colorHex = $isDark ? '#30d158' : '#34c759';
      colorRgb = $isDark ? '48, 209, 88' : '52, 199, 89';
      break;
    default:
      colorHex = '#8e8e93';
      colorRgb = '142, 142, 147';
  }

  return css`
    background-color: rgba(${colorRgb}, ${$isDark ? '0.15' : '0.1'});
    color: ${colorHex};
  `;
};

// --- Styled Components ---

const Card = styled.article<{ $isDark: boolean }>`
  position: relative;
  display: grid;
  gap: 12px;
  min-height: 146px;
  padding: 24px;
  border-radius: 24px;
  
  /* ✨ 그라데이션 완벽 제거: 깔끔한 단색 배경 및 미니멀한 테두리 */
  background-color: ${({ $isDark }) => ($isDark ? '#1c1c1e' : '#ffffff')};
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)')};

  /* 부드러운 기본 그림자 */
  box-shadow: ${({ $isDark }) => 
    $isDark 
      ? '0 4px 16px rgba(0, 0, 0, 0.2)' 
      : '0 4px 16px rgba(0, 0, 0, 0.03), 0 1px 4px rgba(0, 0, 0, 0.02)'};
  
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  /* 호버 시 깔끔하게 떠오르는 효과 */
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ $isDark }) => 
      $isDark 
        ? '0 12px 24px rgba(0, 0, 0, 0.4)' 
        : '0 12px 24px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.03)'};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const CardLabel = styled.div<{ $isDark: boolean }>`
  font-size: 17px;
  font-weight: 700;
  color: ${({ $isDark }) => ($isDark ? '#e5e5ea' : '#1d1d1f')};
  margin-top: 4px;
  letter-spacing: -0.01em;
`;

const IconBubble = styled.div<{ $tone: SummaryTone; $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  font-size: 20px;
  
  /* 분리한 아이콘 스타일 로직 적용 */
  ${({ $tone, $isDark }) => getIconBubbleStyle($tone, $isDark)}
`;

const CardValue = styled.div<{ $isDark: boolean }>`
  font-size: 42px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#000000')};
`;

const CardCaption = styled.div<{ $isDark: boolean }>`
  font-size: 15px;
  line-height: 1.6;
  color: ${({ $isDark }) => ($isDark ? '#8e8e93' : '#86868b')};
  font-weight: 600;
`;

export default StatusCard;