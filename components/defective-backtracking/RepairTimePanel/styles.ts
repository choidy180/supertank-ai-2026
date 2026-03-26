import styled from 'styled-components';
import { SectionCard } from '../shared/styles';

export const PanelRoot = styled(SectionCard)`
  display: grid;
  gap: 18px;
`;

export const HeaderGroup = styled.div`
  display: grid;
  gap: 6px;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-strong);
`;

export const Caption = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
`;
