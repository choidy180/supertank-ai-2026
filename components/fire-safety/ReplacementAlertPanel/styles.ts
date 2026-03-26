import styled from 'styled-components';
import {
  Panel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  buttonReset
} from '../shared/styles';

export {
  Panel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup
};

export const AlertList = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 16px;
  min-height: 0;
  overflow: auto;
`;

export const AlertItem = styled.button<{
  $tone: 'amber' | 'red';
  $selected: boolean;
}>`
  ${buttonReset};
  display: grid;
  gap: 6px;
  width: 100%;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid
    ${({ $tone, $selected }) => {
      if ($selected) {
        return $tone === 'red'
          ? 'rgba(255, 105, 119, 0.34)'
          : 'rgba(255, 190, 87, 0.34)';
      }

      return $tone === 'red'
        ? 'rgba(255, 105, 119, 0.18)'
        : 'rgba(255, 190, 87, 0.18)';
    }};
  background:
    ${({ $tone, $selected }) => {
      if ($tone === 'red') {
        return $selected
          ? 'rgba(255, 105, 119, 0.14)'
          : 'rgba(255, 105, 119, 0.08)';
      }

      return $selected
        ? 'rgba(255, 190, 87, 0.14)'
        : 'rgba(255, 190, 87, 0.08)';
    }};
  text-align: left;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

export const AlertTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: var(--text-strong);
`;

export const AlertDate = styled.div<{ $tone?: 'amber' | 'red' }>`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: ${({ $tone = 'amber' }) =>
    $tone === 'red' ? 'var(--red)' : 'var(--amber)'};
`;

export const AlertMeta = styled.div`
  font-size: 16px;
  color: #c7ecee;
`;
