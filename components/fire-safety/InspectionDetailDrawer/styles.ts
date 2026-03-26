import styled from 'styled-components';
import { buttonReset } from '../shared/styles';

export const DrawerBackdrop = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 12, 0.48);
  backdrop-filter: blur(6px);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
  transition: opacity 180ms ease;
  z-index: 20;
`;

export const Drawer = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 24px;
  right: 24px;
  bottom: 24px;
  width: min(460px, calc(100vw - 32px));
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  border-radius: 28px;
  border: 1px solid rgba(132, 154, 199, 0.16);
  background:
    linear-gradient(180deg, rgba(13, 24, 46, 0.97) 0%, rgba(8, 16, 31, 0.98) 100%);
  box-shadow:
    0 32px 72px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transform: translateX(${({ $open }) => ($open ? '0' : '110%')});
  transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
  z-index: 30;
  overflow: hidden;
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 22px 18px;
  border-bottom: 1px solid rgba(132, 154, 199, 0.12);
`;

export const DrawerHeaderTitleGroup = styled.div`
  display: grid;
  gap: 6px;
`;

export const DrawerEyebrow = styled.div`
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--text-muted);
`;

export const DrawerTitle = styled.div`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text-strong);
`;

export const CloseButton = styled.button`
  ${buttonReset};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(132, 154, 199, 0.16);
  background: rgba(16, 28, 53, 0.72);
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 700;
`;

export const DrawerBody = styled.div`
  min-height: 0;
  overflow: auto;
  padding: 20px 22px 24px;
  display: grid;
  align-content: start;
  gap: 16px;
`;

export const StatusBadge = styled.div<{ $tone: 'green' | 'amber' | 'red' }>`
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 8px 18px;
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
  font-size: 16px;
  font-weight: 700;
  color: var(--text-strong);
`;

export const DrawerMetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`;

export const DrawerMetricCard = styled.div`
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.1);
  background: rgba(16, 28, 53, 0.72);
`;

export const DrawerMetricLabel = styled.div`
  font-size: 16px;
  text-transform: uppercase;
  color: #c7ecee;
`;

export const DrawerMetricValue = styled.div`
  margin-top: 8px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--text-primary);
`;

export const DrawerSection = styled.section`
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.1);
  background: rgba(16, 28, 53, 0.68);
`;

export const DrawerSectionTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-strong);
`;

export const DrawerSectionText = styled.div`
  margin-top: 8px;
  font-size: 18px;
  line-height: 1.4;
  color: #dff9fb;
`;

export const DrawerList = styled.ul`
  margin: 10px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
  font-size: 16px;
  line-height: 1.4;
  color: #dff9fb;
`;

export const DrawerRelatedCard = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(132, 154, 199, 0.1);
  background: rgba(9, 18, 33, 0.86);
`;

export const RelatedTitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #dff9fb;
`;

export const RelatedText = styled.div`
  margin-top: 8px;
  font-size: 16px;
  line-height: 1.8;
  color: #dff9fb;
`;

export const EmptyDrawer = styled.div`
  display: grid;
  place-items: center;
  min-height: 220px;
  padding: 24px;
  text-align: center;
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-secondary);
`;
