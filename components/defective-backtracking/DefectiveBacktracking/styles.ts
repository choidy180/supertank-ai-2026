import styled from 'styled-components';

export const DashboardGrid = styled.section`
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) 380px;
  gap: 20px;

  @media (max-width: 1180px) {
    grid-template-columns: 1fr;
  }
`;
