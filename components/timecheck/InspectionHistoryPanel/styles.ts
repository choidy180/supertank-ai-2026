import styled from 'styled-components';

import { buttonReset } from '../shared/styles';

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
`;

export const FilterChip = styled.button<{ $active: boolean }>`
  ${buttonReset};
  min-height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'rgba(74, 140, 255, 0.36)' : 'rgba(133, 154, 194, 0.16)'};
  background: ${({ $active }) =>
    $active ? 'rgba(74, 140, 255, 0.12)' : 'rgba(15, 28, 53, 0.76)'};
  font-size: 16px;
  font-weight: 700;
  color: #eef3ff;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? 'rgba(74, 140, 255, 0.2)' : 'rgba(133, 154, 194, 0.1)'};
  }
`;

export const TimelineWrap = styled.div`
  flex: 1;
  min-height: 0;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(133, 154, 194, 0.3);
    border-radius: 999px;
  }
`;

export const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px; /* 카드 사이의 간격 */
`;

export const TimelineItem = styled.div`
  width: 100%;
`;

export const TimelineCardButton = styled.button<{ $focused: boolean }>`
  ${buttonReset};
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px; /* 내부 여백 시원하게 확보 */
  border-radius: 16px;
  border: 1px solid
    ${({ $focused }) =>
      $focused ? 'rgba(74, 140, 255, 0.4)' : 'rgba(133, 154, 194, 0.15)'};
  background: ${({ $focused }) =>
    $focused ? 'rgba(24, 45, 87, 0.92)' : 'rgba(18, 32, 60, 0.76)'};
  text-align: left;
  cursor: pointer;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-2px);
    background: ${({ $focused }) =>
      $focused ? 'rgba(24, 45, 87, 0.92)' : 'rgba(24, 42, 77, 0.8)'};
  }
`;

export const TimelineCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 양끝 정렬 */
  width: 100%;
  margin-bottom: 12px;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const TimelineTitle = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
  word-break: keep-all; /* 단어 단위 줄바꿈 유지 */
`;

export const TimelineBadge = styled.div<{ $level: 'ok' | 'warning' | 'error' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  flex-shrink: 0; /* 배지 찌그러짐 방지 */
  white-space: nowrap; 

  border: 1px solid
    ${({ $level }) => {
      switch ($level) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.3)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.3)';
        case 'error':
          return 'rgba(255, 92, 108, 0.3)';
        default:
          return 'rgba(133, 154, 194, 0.2)';
      }
    }};
  background:
    ${({ $level }) => {
      switch ($level) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.15)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.15)';
        case 'error':
          return 'rgba(255, 92, 108, 0.15)';
        default:
          return 'rgba(15, 28, 53, 0.76)';
      }
    }};
  font-size: 14px;
  font-weight: 800;
  color: #ffffff;
`;

export const TimelineTime = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #7f95c0;
  flex-shrink: 0; /* 시간 텍스트 찌그러짐 방지 */
`;

export const TimelineDetail = styled.div`
  font-size: 16px;
  line-height: 1.6;
  color: #c4d4f2;
  margin-bottom: 12px;
  word-break: keep-all;
`;

export const TimelineMeta = styled.div`
  font-size: 14px;
  color: #9ab0da;
  word-break: keep-all;
`;

export const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 240px;
  padding: 24px;
  border-radius: 20px;
  border: 1px dashed rgba(133, 154, 194, 0.2);
  background: rgba(16, 28, 53, 0.5);
  text-align: center;
  font-size: 16px;
  line-height: 1.8;
  color: #9ab0da;
`;