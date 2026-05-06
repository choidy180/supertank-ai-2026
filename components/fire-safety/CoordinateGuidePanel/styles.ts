import styled from 'styled-components';

import {
  Panel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
} from '../shared/styles';

export {
  Panel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
};

export const FillerContent = styled.div`
  display: grid;
  align-content: start;
  gap: 12px;
  min-height: 0;
  margin-top: 16px;
`;

export const SmallCard = styled.div`
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: var(--color-surface-muted);
  color: var(--color-text-primary);
`;

export const SmallTitle = styled.div`
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.02em;
  word-break: keep-all;
`;

export const SmallText = styled.div`
  margin-top: 6px;
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.7;
  word-break: keep-all;
`;