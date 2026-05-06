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
  width: 100%;
  padding: 16px 18px;
  border: 1px solid
    ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-border)'};
  border-radius: 18px;
  background: ${({ $active }) =>
    $active ? 'var(--color-accent-soft)' : 'var(--color-surface-muted)'};
  color: var(--color-text-primary);
  text-align: left;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateX(3px);
    border-color: ${({ $active }) =>
      $active ? 'var(--color-accent)' : 'var(--color-border-strong)'};
    background: ${({ $active }) =>
      $active ? 'var(--color-accent-soft)' : 'var(--color-surface-hover)'};
  }

  &:focus-visible {
    outline: 3px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

export const SlotRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
`;

export const SlotTime = styled.div`
  color: var(--color-text-primary);
  font-size: 24px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.04em;
`;

export const SlotCaption = styled.div`
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.4;
`;

export const SlotIndicator = styled.div<{ $active: boolean }>`
  width: 10px;
  height: 10px;
  flex: 0 0 auto;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? 'var(--color-accent)' : 'var(--color-border-strong)'};
`;