import styled from 'styled-components';

export const SelectedEquipmentCardWrap = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(300px, 0.7fr);
  gap: 16px;
  padding: 18px;
  border-radius: 22px;
  border: 1px solid rgba(132, 154, 199, 0.12);
  background: rgba(11, 20, 39, 0.82);

  @media (max-width: 1460px) {
    grid-template-columns: 1fr;
  }
`;

export const SelectedInfo = styled.div`
  display: grid;
  gap: 14px;
`;

export const InfoHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const InfoTitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

export const InfoEyebrow = styled.div`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

export const InfoTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-strong);
`;

export const StatusBadge = styled.div<{ $tone: 'green' | 'amber' | 'red' }>`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid
    ${({ $tone }) => {
      switch ($tone) {
        case 'green':
          return 'rgba(47, 209, 132, 0.26)';
        case 'amber':
          return 'rgba(255, 190, 87, 0.26)';
        case 'red':
          return 'rgba(255, 105, 119, 0.26)';
        default:
          return 'rgba(132, 154, 199, 0.18)';
      }
    }};
  background:
    ${({ $tone }) => {
      switch ($tone) {
        case 'green':
          return 'rgba(47, 209, 132, 0.12)';
        case 'amber':
          return 'rgba(255, 190, 87, 0.12)';
        case 'red':
          return 'rgba(255, 105, 119, 0.12)';
        default:
          return 'rgba(132, 154, 199, 0.1)';
      }
    }};
  font-size: 12px;
  font-weight: 700;
  color: var(--text-strong);
`;

export const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 1460px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const MetricCard = styled.div`
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.1);
  background: rgba(16, 28, 53, 0.74);
`;

export const MetricLabel = styled.div`
  font-size: 18px;
  text-transform: uppercase;
  color: #c7ecee;
`;

export const MetricValue = styled.div`
  margin-top: 4px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--text-primary);
`;

export const SelectedNote = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.1);
  background: rgba(16, 28, 53, 0.66);
  font-size: 18px;
  line-height: 1.7;
  color: #dff9fb;
`;

export const CoordinateHint = styled.div`
  display: grid;
  align-content: start;
  gap: 12px;
`;

export const CoordinateCard = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.12);
  background: rgba(16, 28, 53, 0.74);
`;

export const CoordinateTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text-strong);
`;

export const CoordinateText = styled.div`
  margin-top: 8px;
  font-size: 17px;
  line-height: 1.4;
  color: var(--text-secondary);
`;

export const Formula = styled.code`
  display: block;
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(8, 16, 31, 0.88);
  border: 1px solid rgba(132, 154, 199, 0.12);
  color: #c6d8ff;
  font-size: 16px;
  line-height: 1.4;
  font-family: 'SFMono-Regular', ui-monospace, SFMono-Regular, Menlo, Monaco,
    Consolas, 'Liberation Mono', 'Courier New', monospace;
  white-space: pre-wrap;
`;
