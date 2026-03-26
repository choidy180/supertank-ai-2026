import styled from 'styled-components';
import {
  Panel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup
} from '../shared/styles';

export {
  Panel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup
};

export const StatusList = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 16px;
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const StatusName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
`;

export const StatusValue = styled.div<{ $tone: 'green' | 'amber' | 'red' }>`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color:
    ${({ $tone }) => {
      switch ($tone) {
        case 'green':
          return 'var(--green)';
        case 'amber':
          return 'var(--amber)';
        case 'red':
          return 'var(--red)';
        default:
          return 'var(--text-strong)';
      }
    }};
`;

export const CardFootnote = styled.div`
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(132, 154, 199, 0.12);
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-muted);
`;
