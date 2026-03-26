import {
  FillerContent,
  Panel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  SmallCard,
  SmallText,
  SmallTitle
} from './styles';

const CoordinateGuidePanel = () => {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitleGroup>
          <PanelTitle>좌표 입력 가이드</PanelTitle>
        </PanelTitleGroup>
      </PanelHeader>

      <FillerContent>
        <SmallCard>
          <SmallTitle>데이터 구조</SmallTitle>
          <SmallText>
            구역별 width, height와 설비별 x, y를 보관하도록 구성했습니다.
            원점 기준은 현재 좌하단으로 처리했습니다.
          </SmallText>
        </SmallCard>

        <SmallCard>
          <SmallTitle>표기 방식</SmallTitle>
          <SmallText>
            left = x / width, top = 1 - y / height 계산값으로 마커를
            배치합니다. 실제 도면 좌표를 그대로 연결하기 좋습니다.
          </SmallText>
        </SmallCard>
      </FillerContent>
    </Panel>
  );
};

export default CoordinateGuidePanel;
