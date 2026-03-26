'use client';

import styled from 'styled-components';
import type { SummaryCard, SummaryTone } from '../model/types';

interface StatusCardProps {
  card: SummaryCard;
}

const StatusCard = ({ card }: StatusCardProps) => {
  return (
    <Card $tone={card.tone}>
      <CardHeader>
        <CardLabel>{card.label}</CardLabel>
        <IconBubble $tone={card.tone}>{card.icon}</IconBubble>
      </CardHeader>

      <CardValue>{card.value}</CardValue>
      <CardCaption>{card.caption}</CardCaption>
      <AccentBar $tone={card.tone} />
    </Card>
  );
};

const Card = styled.article<{ $tone: SummaryTone }>`
  position: relative;
  display: grid;
  gap: 10px;
  min-height: 146px;
  padding: 18px 18px 20px;
  border-radius: 22px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'incident':
          return 'rgba(255, 107, 134, 0.18)';
        case 'processing':
          return 'rgba(78, 143, 255, 0.18)';
        case 'done':
          return 'rgba(47, 214, 152, 0.18)';
        default:
          return 'rgba(113, 143, 199, 0.16)';
      }
    }};
  background:
    linear-gradient(180deg, rgba(12, 25, 52, 0.94) 0%, rgba(9, 18, 37, 0.96) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 18px 38px rgba(0, 0, 0, 0.24);
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const CardLabel = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
`;

const IconBubble = styled.div<{ $tone: SummaryTone }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 14px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'incident':
          return 'rgba(255, 107, 134, 0.24)';
        case 'processing':
          return 'rgba(78, 143, 255, 0.24)';
        case 'done':
          return 'rgba(47, 214, 152, 0.24)';
        default:
          return 'rgba(113, 143, 199, 0.18)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'incident':
          return 'rgba(255, 107, 134, 0.12)';
        case 'processing':
          return 'rgba(78, 143, 255, 0.12)';
        case 'done':
          return 'rgba(47, 214, 152, 0.12)';
        default:
          return 'rgba(113, 143, 199, 0.12)';
      }
    }};
  font-size: 24px;
  font-weight: 800;
  color:
    ${({ $tone }) => {
      switch ($tone) {
        case 'incident':
          return 'var(--red)';
        case 'processing':
          return 'var(--blue)';
        case 'done':
          return 'var(--green)';
        default:
          return 'var(--text-primary)';
      }
    }};
`;

const CardValue = styled.div`
  font-size: 48px;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.06em;
  color: var(--text-strong);
`;

const CardCaption = styled.div`
  font-size: 20px;
  line-height: 1.7;
  color: #ffffff;
  font-weight: 600;
`;

const AccentBar = styled.div<{ $tone: SummaryTone }>`
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: 0;
  height: 3px;
  border-radius: 999px 999px 0 0;
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'incident':
          return 'linear-gradient(90deg, rgba(255, 107, 134, 0.92) 0%, rgba(255, 107, 134, 0) 100%)';
        case 'processing':
          return 'linear-gradient(90deg, rgba(78, 143, 255, 0.92) 0%, rgba(78, 143, 255, 0) 100%)';
        case 'done':
          return 'linear-gradient(90deg, rgba(47, 214, 152, 0.92) 0%, rgba(47, 214, 152, 0) 100%)';
        default:
          return 'linear-gradient(90deg, rgba(113, 143, 199, 0.92) 0%, rgba(113, 143, 199, 0) 100%)';
      }
    }};
`;

export default StatusCard;
