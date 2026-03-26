import styled from 'styled-components';

import { buttonReset } from '../shared/styles';

export const DetailCard = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(300px, 0.8fr);
  gap: 16px;
  margin-top: 18px;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(133, 154, 194, 0.12);
  background: rgba(11, 20, 39, 0.82);
`;

export const DetailInfo = styled.div`
  display: grid;
  gap: 14px;
`;

export const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const DetailTitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

export const DetailEyebrow = styled.div`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #7f95c0;
`;

export const DetailTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

export const StatusBadge = styled.div<{ $status: 'ok' | 'warning' | 'error' | 'idle' }>`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $status }) => {
      switch ($status) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.26)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.26)';
        case 'error':
          return 'rgba(255, 92, 108, 0.26)';
        case 'idle':
          return 'rgba(133, 154, 194, 0.18)';
        default:
          return 'rgba(133, 154, 194, 0.18)';
      }
    }};
  background:
    ${({ $status }) => {
      switch ($status) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.12)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.12)';
        case 'error':
          return 'rgba(255, 92, 108, 0.12)';
        case 'idle':
          return 'rgba(133, 154, 194, 0.1)';
        default:
          return 'rgba(133, 154, 194, 0.1)';
      }
    }};
  font-size: 16px;
  font-weight: 700;
  color: #eef3ff;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;

export const DetailMetric = styled.div`
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(133, 154, 194, 0.1);
  background: rgba(16, 28, 53, 0.74);
`;

export const DetailMetricLabel = styled.div`
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8b98b1;
  font-weight: 600;
`;

export const DetailMetricValue = styled.div`
  /* margin-top: 8px; */
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
`;

export const DetailNote = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(133, 154, 194, 0.1);
  background: rgba(16, 28, 53, 0.66);
  font-size: 18px;
  line-height: 1;
  font-weight: 600;
  color: #9bb0d9;
`;

export const ActionPanel = styled.div`
  display: grid;
  align-content: space-between;
  gap: 16px;
`;

export const ActionTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #eef3ff;
`;

export const ActionDescription = styled.div`
  font-size: 16px;
  line-height: 1.4;
  color: #c7ecee;
  margin-top: 8px;
`;

export const ActionButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
`;

export const StatusActionButton = styled.button<{
  $tone: 'ok' | 'warning' | 'error';
}>`
  ${buttonReset};
  min-height: 50px;
  border-radius: 16px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.26)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.26)';
        case 'error':
          return 'rgba(255, 92, 108, 0.26)';
        default:
          return 'rgba(133, 154, 194, 0.18)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'ok':
          return 'rgba(46, 209, 129, 0.12)';
        case 'warning':
          return 'rgba(255, 182, 72, 0.12)';
        case 'error':
          return 'rgba(255, 92, 108, 0.12)';
        default:
          return 'rgba(16, 28, 53, 0.7)';
      }
    }};
  font-size: 14px;
  font-weight: 700;
  color: #f7fbff;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;
