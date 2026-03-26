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

export const FillerContent = styled.div`
  display: grid;
  align-content: start;
  gap: 12px;
  margin-top: 16px;
`;

export const SmallCard = styled.div`
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.12);
  background: rgba(17, 30, 56, 0.72);
`;

export const SmallTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
`;

export const SmallText = styled.div`
  margin-top: 6px;
  font-size: 16px;
  line-height: 1.7;
  color: #c7ecee;
`;
