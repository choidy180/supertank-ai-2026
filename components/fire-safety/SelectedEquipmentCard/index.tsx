import { getMarkerTone, getReplacementLabel } from '../model/helpers';
import { FlattenedEquipment, InspectionRecord } from '../model/types';
import {
  CoordinateCard,
  CoordinateHint,
  CoordinateText,
  CoordinateTitle,
  Formula,
  InfoEyebrow,
  InfoHeader,
  InfoTitle,
  InfoTitleGroup,
  MetricCard,
  MetricGrid,
  MetricLabel,
  MetricValue,
  SelectedEquipmentCardWrap,
  SelectedInfo,
  SelectedNote,
  StatusBadge
} from './styles';

interface SelectedEquipmentCardProps {
  selectedEquipment: FlattenedEquipment;
  relatedInspection: InspectionRecord | null;
}

const SelectedEquipmentCard = ({
  selectedEquipment,
  relatedInspection
}: SelectedEquipmentCardProps) => {
  return (
    <SelectedEquipmentCardWrap>
      <SelectedInfo>
        <InfoHeader>
          <InfoTitleGroup>
            <InfoEyebrow>selected equipment</InfoEyebrow>
            <InfoTitle>
              {selectedEquipment.zoneName} · {selectedEquipment.name}
            </InfoTitle>
          </InfoTitleGroup>

          <StatusBadge $tone={getMarkerTone(selectedEquipment.replacementState)}>
            {getReplacementLabel(selectedEquipment.replacementState)}
          </StatusBadge>
        </InfoHeader>

        <MetricGrid>
          <MetricCard>
            <MetricLabel>설치 위치</MetricLabel>
            <MetricValue>{selectedEquipment.installSpot}</MetricValue>
          </MetricCard>

          <MetricCard>
            <MetricLabel>좌표</MetricLabel>
            <MetricValue>
              x {selectedEquipment.x}m · y {selectedEquipment.y}m
            </MetricValue>
          </MetricCard>

          <MetricCard>
            <MetricLabel>마지막 점검</MetricLabel>
            <MetricValue>{selectedEquipment.lastInspection}</MetricValue>
          </MetricCard>

          <MetricCard>
            <MetricLabel>압력 상태</MetricLabel>
            <MetricValue>{selectedEquipment.pressure}</MetricValue>
          </MetricCard>
        </MetricGrid>

        <SelectedNote>
          {selectedEquipment.note}
          {relatedInspection
            ? ` · 최근 점검 메모: ${relatedInspection.summary}`
            : ''}
        </SelectedNote>
      </SelectedInfo>

      <CoordinateHint>
        <CoordinateCard>
          <CoordinateTitle>좌표 계산 방식</CoordinateTitle>
          <CoordinateText>
            실제 공장 도면의 width / height와 설비 좌표 x, y를 넣으면 이
            카드처럼 자동 배치되도록 만들어뒀습니다.
          </CoordinateText>

          <Formula>
            left = (x / width) * 100{'\n'}
            top = origin === 'bottom-left' ? (1 - y / height) * 100 : (y /
            height) * 100
          </Formula>
        </CoordinateCard>

        <CoordinateCard>
          <CoordinateTitle>연결 가능한 확장 포인트</CoordinateTitle>
          <CoordinateText>
            실제 데이터 연동 시 소화전, 감지기, 비상벨 등 다른 설비 타입도
            같은 구조로 추가할 수 있습니다.
          </CoordinateText>
        </CoordinateCard>
      </CoordinateHint>
    </SelectedEquipmentCardWrap>
  );
};

export default SelectedEquipmentCard;
