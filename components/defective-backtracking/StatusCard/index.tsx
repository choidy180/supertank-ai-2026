import { renderSummaryIcon } from '../icons';
import type { SummaryCardData } from '../model/types';
import { CardLabel, CardRoot, CardTop, IconWrap, Suffix, Value, ValueWrap } from './styles';

interface StatusCardProps {
  key?: string;
  item: SummaryCardData;
}

const StatusCard = ({ item }: StatusCardProps) => {
  return (
    <CardRoot>
      <CardTop>
        <CardLabel>{item.label}</CardLabel>
        <IconWrap>{renderSummaryIcon(item.icon)}</IconWrap>
      </CardTop>

      <ValueWrap>
        <Value>{item.value}</Value>
        <Suffix>건</Suffix>
      </ValueWrap>
    </CardRoot>
  );
};

export default StatusCard;
