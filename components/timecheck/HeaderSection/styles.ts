import styled from 'styled-components';

import { buttonReset } from '../shared/styles';

export const HeaderBar = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 22px;
`;

export const TitleBlock = styled.div`
  display: grid;
  gap: 8px;
`;

export const Eyebrow = styled.div`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #7e97c9;
`;

export const MainTitle = styled.h1`
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.04em;
`;

export const SubText = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #9db0d7;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const HeaderPill = styled.div<{
  $tone: 'live' | 'ok' | 'warning' | 'error' | 'neutral';
}>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'live':
          return 'rgba(74, 140, 255, 0.42)';
        case 'ok':
          return 'rgba(46, 209, 129, 0.28)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.28)';
        case 'error':
          return 'rgba(255, 92, 108, 0.28)';
        default:
          return 'rgba(133, 154, 194, 0.2)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'live':
          return 'rgba(74, 140, 255, 0.14)';
        case 'ok':
          return 'rgba(46, 209, 129, 0.12)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.12)';
        case 'error':
          return 'rgba(255, 92, 108, 0.12)';
        default:
          return 'rgba(109, 127, 163, 0.12)';
      }
    }};
  font-size: 13px;
  font-weight: 700;
  color: #eef3ff;
`;

export const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #4a8cff;
  box-shadow: 0 0 16px rgba(74, 140, 255, 0.8);
`;

export const AutoRunButton = styled.button<{ $active: boolean }>`
  ${buttonReset};
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'rgba(74, 140, 255, 0.42)' : 'rgba(133, 154, 194, 0.2)'};
  background: ${({ $active }) =>
    $active ? 'rgba(74, 140, 255, 0.14)' : 'rgba(13, 24, 46, 0.92)'};
  font-size: 13px;
  font-weight: 700;
  color: #f5f7ff;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;
