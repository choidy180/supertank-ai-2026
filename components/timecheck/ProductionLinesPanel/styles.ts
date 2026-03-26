import styled, { css } from 'styled-components';

import { buttonReset, pulse } from '../shared/styles';

export const LineHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
`;

export const LineHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const MiniPill = styled.div<{
  $tone: 'ok' | 'warning' | 'error' | 'neutral';
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.24)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.24)';
        case 'error':
          return 'rgba(255, 92, 108, 0.24)';
        default:
          return 'rgba(133, 154, 194, 0.18)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.1)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.1)';
        case 'error':
          return 'rgba(255, 92, 108, 0.1)';
        default:
          return 'rgba(19, 34, 62, 0.82)';
      }
    }};
  font-size: 16px;
  font-weight: 700;
  color: #eff4ff;
`;

export const LinesArea = styled.div`
  display: grid;
  gap: 14px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
`;

export const LineRow = styled.div<{ $selected: boolean }>`
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr) 168px;
  align-items: center;
  gap: 18px;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid
    ${({ $selected }) =>
      $selected ? 'rgba(74, 140, 255, 0.32)' : 'rgba(133, 154, 194, 0.12)'};
  background: ${({ $selected }) =>
    $selected ? 'rgba(18, 35, 67, 0.92)' : 'rgba(12, 22, 42, 0.74)'};
  box-shadow: ${({ $selected }) =>
    $selected ? '0 18px 38px rgba(0, 0, 0, 0.24)' : 'none'};
  transition:
    border-color 160ms ease,
    background 160ms ease,
    transform 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

export const LineLabelButton = styled.button`
  ${buttonReset};
  display: grid;
  gap: 6px;
  text-align: left;
`;

export const LineName = styled.div`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

export const LineShift = styled.div`
  font-size: 16px;
  color: #8ea0c7;
`;

export const NodeRail = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0;
`;

export const NodeTrack = styled.div`
  position: absolute;
  top: 24px;
  left: 9%;
  right: 9%;
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    rgba(95, 123, 175, 0.22) 0%,
    rgba(95, 123, 175, 0.4) 100%
  );
`;

export const NodeSlot = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  justify-items: center;
  gap: 10px;
`;

export const NodeButton = styled.button<{
  $status: 'ok' | 'warning' | 'error' | 'idle';
  $selected: boolean;
}>`
  ${buttonReset};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  border: 2px solid
    ${({ $status }) => {
      switch ($status) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.5)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.5)';
        case 'error':
          return 'rgba(255, 92, 108, 0.56)';
        case 'idle':
          return 'rgba(133, 154, 194, 0.22)';
        default:
          return 'rgba(133, 154, 194, 0.22)';
      }
    }};
  background:
    ${({ $status }) => {
      switch ($status) {
        case 'ok':
          return 'linear-gradient(180deg, rgba(46, 209, 129, 0.24) 0%, rgba(24, 90, 61, 0.62) 100%)';
        case 'warning':
          return 'linear-gradient(180deg, rgba(255, 182, 72, 0.24) 0%, rgba(117, 76, 21, 0.62) 100%)';
        case 'error':
          return 'linear-gradient(180deg, rgba(255, 92, 108, 0.24) 0%, rgba(126, 34, 47, 0.68) 100%)';
        case 'idle':
          return 'linear-gradient(180deg, rgba(133, 154, 194, 0.12) 0%, rgba(32, 47, 75, 0.72) 100%)';
        default:
          return 'linear-gradient(180deg, rgba(133, 154, 194, 0.12) 0%, rgba(32, 47, 75, 0.72) 100%)';
      }
    }};
  font-size: 28px;
  font-weight: 600;
  color: #ffffff;
  box-shadow: ${({ $selected }) =>
    $selected ? '0 0 0 6px rgba(74, 140, 255, 0.16)' : 'none'};
  ${({ $selected }) =>
    $selected
      ? css`
          animation: ${pulse} 2.1s infinite;
        `
      : 'animation: none;'}
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const NodeLabel = styled.div<{ $selected: boolean }>`
  font-size: 16px;
  font-weight: ${({ $selected }) => ($selected ? 700 : 600)};
  color: ${({ $selected }) => ($selected ? '#eef4ff' : '#ffffff')};
  text-align: center;
  line-height: 1.4;
`;

export const LineSummary = styled.div`
  display: grid;
  gap: 8px;
  justify-items: end;
`;

export const SummaryPill = styled.div<{ $tone: 'ok' | 'warning' | 'error' }>`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.24)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.24)';
        case 'error':
          return 'rgba(255, 92, 108, 0.24)';
        default:
          return 'rgba(133, 154, 194, 0.18)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.1)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.1)';
        case 'error':
          return 'rgba(255, 92, 108, 0.1)';
        default:
          return 'rgba(133, 154, 194, 0.1)';
      }
    }};
  font-size: 14px;
  font-weight: 700;
  color: #eff3ff;
`;
