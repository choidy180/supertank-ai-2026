import styled from 'styled-components';

import { buttonReset } from '../shared/styles';

export const SlotList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 8px;
`;

export const SlotButton = styled.button<{ $active: boolean }>`
  ${buttonReset};
  display: grid;
  gap: 6px;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'rgba(74, 140, 255, 0.42)' : 'rgba(133, 154, 194, 0.12)'};
  background: ${({ $active }) =>
    $active ? 'rgba(74, 140, 255, 0.12)' : 'rgba(16, 28, 53, 0.78)'};
  text-align: left;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateX(3px);
  }
`;

export const SlotTime = styled.div`
  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.04em;
`;

export const SlotCaption = styled.div`
  font-size: 16px;
  color: #8ea0c7;
`;

export const SlotIndicator = styled.div<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? '#4a8cff' : 'rgba(122, 140, 181, 0.36)'};
  box-shadow: ${({ $active }) =>
    $active ? '0 0 14px rgba(74, 140, 255, 0.55)' : 'none'};
`;

export const SlotRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;
