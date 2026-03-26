import styled from 'styled-components';
import { SurfacePanel } from '../shared/styles';

export const OverviewRoot = styled(SurfacePanel)`
  gap: 18px;
  overflow: hidden;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const TitleGroup = styled.div`
  display: grid;
  gap: 8px;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #ffffff;
`;

export const Caption = styled.p`
  margin: 0;
  max-width: 720px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
`;

export const MetaGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const MetaPill = styled.div<{ $tone?: 'neutral' | 'navy' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid ${({ $tone = 'neutral' }) => ($tone === 'navy' ? 'rgba(11, 95, 151, 0.16)' : 'var(--border-soft)')};
  background: ${({ $tone = 'neutral' }) => ($tone === 'navy' ? 'var(--navy-soft)' : 'var(--surface-4)')};
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
`;

export const LiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--navy);
  box-shadow: 0 0 14px rgba(11, 95, 151, 0.34);
`;

export const SectionStack = styled.div`
  min-height: 0;
  display: grid;
  gap: 16px;
  overflow: auto;
  padding-right: 4px;
`;
