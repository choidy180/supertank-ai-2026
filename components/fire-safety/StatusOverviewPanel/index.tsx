import {
  CardFootnote,
  Panel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  StatusList,
  StatusName,
  StatusRow,
  StatusValue
} from './styles';

interface StatusOverviewPanelProps {
  stableCount: number;
  replaceNowCount: number;
  dueSoonCount: number;
}

const StatusOverviewPanel = ({
  stableCount,
  replaceNowCount,
  dueSoonCount
}: StatusOverviewPanelProps) => {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitleGroup>
          <PanelTitle>전체 설비 현황</PanelTitle>
        </PanelTitleGroup>
      </PanelHeader>

      <StatusList>
        <StatusRow>
          <StatusName>정상</StatusName>
          <StatusValue $tone="green">{stableCount}</StatusValue>
        </StatusRow>
        <StatusRow>
          <StatusName>교체필요</StatusName>
          <StatusValue $tone="red">{replaceNowCount}</StatusValue>
        </StatusRow>
        <StatusRow>
          <StatusName>교체도래</StatusName>
          <StatusValue $tone="amber">{dueSoonCount}</StatusValue>
        </StatusRow>
      </StatusList>
    </Panel>
  );
};

export default StatusOverviewPanel;
