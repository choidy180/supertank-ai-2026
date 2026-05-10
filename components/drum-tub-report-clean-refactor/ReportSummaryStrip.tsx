import type { SummaryCard } from '@/model/drum-tub-report-clean-refactor/types';
import { SummaryStrip, SummaryTile } from '@/styles/drum-tub-report-clean-refactor/styles';

type ReportSummaryStripProps = {
  items: SummaryCard[];
};

const ReportSummaryStrip = ({ items }: ReportSummaryStripProps) => {
  return (
    <SummaryStrip>
      {items.map((card) => (
        <SummaryTile key={card.id} $tone={card.tone}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <small>{card.caption}</small>
        </SummaryTile>
      ))}
    </SummaryStrip>
  );
};

export default ReportSummaryStrip;
