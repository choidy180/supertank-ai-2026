import styled from 'styled-components';

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 840px) {
    grid-template-columns: 1fr;
  }
`;
