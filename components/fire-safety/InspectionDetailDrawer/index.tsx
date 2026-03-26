import {
  getInspectionLevelLabel,
  getInspectionTone,
  getReplacementLabel
} from '../model/helpers';
import { FlattenedEquipment, InspectionRecord } from '../model/types';
import {
  CloseButton,
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerEyebrow,
  DrawerHeader,
  DrawerHeaderTitleGroup,
  DrawerList,
  DrawerMetricCard,
  DrawerMetricGrid,
  DrawerMetricLabel,
  DrawerMetricValue,
  DrawerRelatedCard,
  DrawerSection,
  DrawerSectionText,
  DrawerSectionTitle,
  DrawerTitle,
  EmptyDrawer,
  RelatedText,
  RelatedTitle,
  StatusBadge
} from './styles';

interface InspectionDetailDrawerProps {
  selectedInspection: InspectionRecord | null;
  selectedEquipment: FlattenedEquipment;
  onClose: () => void;
}

const InspectionDetailDrawer = ({
  selectedInspection,
  selectedEquipment,
  onClose
}: InspectionDetailDrawerProps) => {
  const isOpen = Boolean(selectedInspection);

  return (
    <>
      <DrawerBackdrop
        $open={isOpen}
        onClick={onClose}
      />

      <Drawer $open={isOpen} aria-hidden={!selectedInspection}>
        <DrawerHeader>
          <DrawerHeaderTitleGroup>
            <DrawerEyebrow>inspection detail</DrawerEyebrow>
            <DrawerTitle>실시간 점검 이력 상세</DrawerTitle>
          </DrawerHeaderTitleGroup>

          <CloseButton
            type="button"
            aria-label="상세 닫기"
            onClick={onClose}
          >
            ×
          </CloseButton>
        </DrawerHeader>

        {selectedInspection ? (
          <DrawerBody>
            <StatusBadge $tone={getInspectionTone(selectedInspection.level)}>
              {getInspectionLevelLabel(selectedInspection.level)}
              {' · '}
              {selectedInspection.detailTitle}
            </StatusBadge>

            <DrawerMetricGrid>
              <DrawerMetricCard>
                <DrawerMetricLabel>점검 일시</DrawerMetricLabel>
                <DrawerMetricValue>
                  {selectedInspection.date}
                  <br />
                  {selectedInspection.timeRange}
                </DrawerMetricValue>
              </DrawerMetricCard>

              <DrawerMetricCard>
                <DrawerMetricLabel>점검자</DrawerMetricLabel>
                <DrawerMetricValue>
                  {selectedInspection.inspector}
                </DrawerMetricValue>
              </DrawerMetricCard>

              <DrawerMetricCard>
                <DrawerMetricLabel>대상 구역</DrawerMetricLabel>
                <DrawerMetricValue>{selectedInspection.zoneName}</DrawerMetricValue>
              </DrawerMetricCard>

              <DrawerMetricCard>
                <DrawerMetricLabel>설비 ID</DrawerMetricLabel>
                <DrawerMetricValue>
                  {selectedInspection.equipmentName}
                </DrawerMetricValue>
              </DrawerMetricCard>
            </DrawerMetricGrid>

            <DrawerSection>
              <DrawerSectionTitle>점검 요약</DrawerSectionTitle>
              <DrawerSectionText>{selectedInspection.summary}</DrawerSectionText>
            </DrawerSection>

            <DrawerSection>
              <DrawerSectionTitle>이상 내용</DrawerSectionTitle>
              <DrawerSectionText>
                {selectedInspection.abnormality}
              </DrawerSectionText>
            </DrawerSection>

            <DrawerSection>
              <DrawerSectionTitle>조치 사항</DrawerSectionTitle>
              <DrawerSectionText>{selectedInspection.action}</DrawerSectionText>
            </DrawerSection>

            <DrawerSection>
              <DrawerSectionTitle>상세 체크 포인트</DrawerSectionTitle>
              <DrawerList>
                {selectedInspection.details.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </DrawerList>
            </DrawerSection>

            <DrawerRelatedCard>
              <RelatedTitle>연결 설비 정보</RelatedTitle>
              <RelatedText>
                {selectedEquipment.zoneName} · {selectedEquipment.installSpot}
                <br />
                좌표 x {selectedEquipment.x}m / y {selectedEquipment.y}m
                <br />
                압력 상태 {selectedEquipment.pressure}
                {' · '}
                교체 상태 {getReplacementLabel(selectedEquipment.replacementState)}
              </RelatedText>
            </DrawerRelatedCard>
          </DrawerBody>
        ) : (
          <EmptyDrawer>
            점검 이력에서 상세 보기 버튼을 누르면
            <br />
            우측 슬라이드 패널에 상세 정보가 표시됩니다.
          </EmptyDrawer>
        )}
      </Drawer>
    </>
  );
};

export default InspectionDetailDrawer;
