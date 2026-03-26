import StatusCard from '../StatusCard';
import type { SummaryCardData } from '../model/types';
import { SummaryGrid } from './styles';

interface SummaryCardsProps {
  items: SummaryCardData[];
}

const SummaryCards = ({ items }: SummaryCardsProps) => {
  return (
    <SummaryGrid>
      {items.map((item) => (
        <StatusCard key={item.id} item={item} />
      ))}
    </SummaryGrid>
  );
};

export default SummaryCards;
