import styled from 'styled-components';
import {
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  RightPanel,
  buttonReset
} from '../shared/styles';

export {
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  RightPanel
};

export const InspectionList = styled.div`
  display: grid;
  gap: 12px;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
`;

export const InspectionCard = styled.div<{
  $tone: 'green' | 'amber' | 'red';
  $selected: boolean;
}>`
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 20px;
  border: 1px solid
    ${({ $selected, $tone }) => {
      if ($selected) {
        return $tone === 'red'
          ? 'rgba(255, 105, 119, 0.28)'
          : $tone === 'amber'
            ? 'rgba(255, 190, 87, 0.28)'
            : 'rgba(47, 209, 132, 0.28)';
      }

      return 'rgba(132, 154, 199, 0.12)';
    }};
  background: ${({ $selected }) =>
    $selected ? 'rgba(18, 35, 67, 0.92)' : 'rgba(15, 28, 53, 0.76)'};
`;

export const InspectionTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const InspectionDate = styled.div`
  font-size: 14px;
  line-height: 1.4;
  color: #c7ecee;
`;

export const InspectionSummary = styled.div`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.55;
  color: var(--text-strong);
`;

export const InspectionSubtext = styled.div`
  font-size: 16px;
  line-height: 1.4;
  color: var(--text-secondary);
`;

export const InspectionMeta = styled.div`
  font-size: 16px;
  color: #c7ecee;
`;

export const DetailButton = styled.button`
  ${buttonReset};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 190, 87, 0.28);
  background: rgba(255, 190, 87, 0.14);
  color: #ffe38d;
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 190, 87, 0.18);
  }
`;
