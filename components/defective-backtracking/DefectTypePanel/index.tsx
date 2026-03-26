import DonutChart from '../charts/DonutChart';
import { formatPercent } from '../model/helpers';
import type { DefectTypeStat } from '../model/types';
import {
  Caption,
  ContentRow,
  Footnote,
  HeaderGroup,
  LegendItem,
  LegendLabel,
  LegendLeft,
  LegendList,
  LegendSwatch,
  LegendValue,
  PanelRoot,
  Title
} from './styles';

interface DefectTypePanelProps {
  items: DefectTypeStat[];
  totalValue: number;
}

const DefectTypePanel = ({ items, totalValue }: DefectTypePanelProps) => {
  return (
    <PanelRoot>
      <HeaderGroup>
        <Title>불량 유형별 통계</Title>
        <Caption>비중이 큰 유형부터 빠르게 파악할 수 있도록 도넛 차트와 범례를 함께 배치했습니다.</Caption>
      </HeaderGroup>

      <ContentRow>
        <DonutChart items={items} />

        <LegendList>
          {items.map((item) => (
            <LegendItem key={item.id}>
              <LegendLeft>
                <LegendSwatch $color={item.color} />
                <LegendLabel>{item.label}</LegendLabel>
              </LegendLeft>

              <LegendValue>{formatPercent(item.value)}</LegendValue>
            </LegendItem>
          ))}

          <Footnote>합계 기준 {totalValue}% · 주요 유형 비율을 작업자 교육 자료와도 바로 연결할 수 있습니다.</Footnote>
        </LegendList>
      </ContentRow>
    </PanelRoot>
  );
};

export default DefectTypePanel;
