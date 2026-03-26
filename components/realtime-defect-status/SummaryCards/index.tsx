'use client';

import styled from 'styled-components';
import type { SummaryCard as SummaryCardType } from '../model/types';
import StatusCard from '../StatusCard';

interface SummaryCardsProps {
  items: SummaryCardType[];
}

const SummaryCards = ({ items }: SummaryCardsProps) => {
  return (
    <Grid>
      {items.map((item) => (
        <StatusCard key={item.id} card={item} />
      ))}
    </Grid>
  );
};

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
  }
`;

export default SummaryCards;
