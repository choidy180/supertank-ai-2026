import { renderHistoryIcon } from '../icons';
import type { RepairHistoryItem } from '../model/types';
import {
  ActionText,
  AxisCol,
  AxisLine,
  Caption,
  Connector,
  Content,
  HeaderRow,
  HistoryRoot,
  IconBubble,
  ItemTitle,
  MetaPill,
  MetaText,
  TimeLabel,
  TimelineItemButton,
  TimelineList,
  TimelineWrap,
  Title,
  TitleGroup,
  TitleRow
} from './styles';

interface RepairHistoryPanelProps {
  items: RepairHistoryItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const RepairHistoryPanel = ({ items, selectedId, onSelect }: RepairHistoryPanelProps) => {
  return (
    <HistoryRoot>
      <HeaderRow>
        <TitleGroup>
          <Title>수리 이력</Title>
          <Caption>최근 처리 순서를 타임라인으로 정리해 작업 흐름을 한 번에 확인할 수 있습니다.</Caption>
        </TitleGroup>

        <MetaPill>최근 {items.length}건</MetaPill>
      </HeaderRow>

      <TimelineWrap>
        <TimelineList>
          {items.map((item, index) => {
            const isActive = item.id === selectedId;
            const isLast = index === items.length - 1;

            return (
              <TimelineItemButton
                key={item.id}
                type="button"
                $active={isActive}
                onClick={() => {
                  onSelect(item.id);
                }}
              >
                <TimeLabel>{item.time}</TimeLabel>

                <AxisCol>
                  {!isLast && <AxisLine />}
                  <IconBubble $active={isActive}>{renderHistoryIcon(item.icon)}</IconBubble>
                </AxisCol>

                <Content>
                  <TitleRow>
                    <Connector />
                    <ItemTitle>{item.title}</ItemTitle>
                  </TitleRow>
                  <MetaText>작업자: {item.worker}</MetaText>
                  <ActionText>조치: {item.action}</ActionText>
                </Content>
              </TimelineItemButton>
            );
          })}
        </TimelineList>
      </TimelineWrap>
    </HistoryRoot>
  );
};

export default RepairHistoryPanel;
