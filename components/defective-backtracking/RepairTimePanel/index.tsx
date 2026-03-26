import BarChart from '../charts/BarChart';
import type { RepairTimeStat } from '../model/types';
import { Caption, HeaderGroup, PanelRoot, Title } from './styles';

interface RepairTimePanelProps {
  items: RepairTimeStat[];
  maxHour: number;
}

const RepairTimePanel = ({ items, maxHour }: RepairTimePanelProps) => {
  return (
    <PanelRoot>
      <HeaderGroup>
        <Title>평균 수리 시간</Title>
        <Caption>주간 수리 시간 흐름을 막대 차트로 정리해 특정 요일의 부담을 빠르게 확인할 수 있습니다.</Caption>
      </HeaderGroup>

      <BarChart items={items} maxHour={maxHour} />
    </PanelRoot>
  );
};

export default RepairTimePanel;
