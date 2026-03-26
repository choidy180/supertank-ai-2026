import { getInspectionLevelLabel, getInspectionTone } from '../model/helpers';
import { InspectionRecord } from '../model/types';
import {
  DetailButton,
  InspectionCard,
  InspectionDate,
  InspectionList,
  InspectionMeta,
  InspectionSubtext,
  InspectionSummary,
  InspectionTop,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  RightPanel
} from './styles';

interface InspectionHistoryPanelProps {
  inspectionHistory: InspectionRecord[];
  selectedInspectionId: string | null;
  onOpenInspection: (record: InspectionRecord) => void;
}

const InspectionHistoryPanel = ({
  inspectionHistory,
  selectedInspectionId,
  onOpenInspection
}: InspectionHistoryPanelProps) => {
  return (
    <RightPanel>
      <PanelHeader>
        <PanelTitleGroup>
          <PanelTitle>실시간 점검 이력</PanelTitle>
        </PanelTitleGroup>
      </PanelHeader>

      <InspectionList>
        {inspectionHistory.map((record) => {
          const tone = getInspectionTone(record.level);
          const isSelected = record.id === selectedInspectionId;

          return (
            <InspectionCard key={record.id} $tone={tone} $selected={isSelected}>
              <InspectionTop>
                <div>
                  <InspectionDate>
                    일자: {record.date}
                    <br />
                    점검 시간: {record.timeRange}
                  </InspectionDate>
                </div>

                <DetailButton
                  type="button"
                  onClick={() => {
                    onOpenInspection(record);
                  }}
                >
                  상세 보기
                </DetailButton>
              </InspectionTop>

              <InspectionSummary>{record.summary}</InspectionSummary>

              <InspectionSubtext>
                이상 여부: {record.abnormality}
              </InspectionSubtext>

              <InspectionMeta>
                {record.zoneName} · {record.equipmentName} · {record.inspector}
                {' · '}
                {getInspectionLevelLabel(record.level)}
              </InspectionMeta>
            </InspectionCard>
          );
        })}
      </InspectionList>
    </RightPanel>
  );
};

export default InspectionHistoryPanel;
