import styled from 'styled-components';
import { SectionCard } from '../shared/styles';

export const CardRoot = styled(SectionCard)`
  display: grid;
  gap: 18px;
  min-height: 154px;
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const CardLabel = styled.div`
  font-size: 15px;
  font-weight: 800;
  color: var(--navy);
`;

export const IconWrap = styled.div`
  color: var(--navy);
  line-height: 0;
`;

export const ValueWrap = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
`;

export const Value = styled.div`
  font-size: 56px;
  line-height: 0.95;
  font-weight: 800;
  letter-spacing: -0.06em;
  color: var(--navy);
`;

export const Suffix = styled.span`
  padding-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
`;
