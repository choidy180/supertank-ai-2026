import { FlattenedEquipment } from '../model/types';
import { getMarkerTone } from '../model/helpers';
import {
  AlertDate,
  AlertItem,
  AlertList,
  AlertMeta,
  AlertTitle,
  Panel,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup
} from './styles';

interface ReplacementAlertPanelProps {
  alertEquipments: FlattenedEquipment[];
  selectedEquipmentId: string;
  onSelectEquipment: (equipmentId: string) => void;
}

const ReplacementAlertPanel = ({
  alertEquipments,
  selectedEquipmentId,
  onSelectEquipment
}: ReplacementAlertPanelProps) => {
  return (
    <Panel>
      <PanelHeader>
        <PanelTitleGroup>
          <PanelTitle>교체 주기 알림</PanelTitle>
        </PanelTitleGroup>
      </PanelHeader>

      <AlertList>
        {alertEquipments.map((equipment) => {
          const tone =
            getMarkerTone(equipment.replacementState) === 'red'
              ? 'red'
              : 'amber';

          return (
            <AlertItem
              key={equipment.id}
              type="button"
              $tone={tone}
              $selected={equipment.id === selectedEquipmentId}
              onClick={() => {
                onSelectEquipment(equipment.id);
              }}
            >
              <AlertTitle>
                {equipment.name} 교체{' '}
                {equipment.replacementState === 'replace-now'
                  ? '필요'
                  : '요망'}
              </AlertTitle>
              <AlertDate $tone={tone}>{equipment.nextReplacement}</AlertDate>
              <AlertMeta>
                {equipment.zoneName} · {equipment.installSpot}
              </AlertMeta>
            </AlertItem>
          );
        })}
      </AlertList>
    </Panel>
  );
};

export default ReplacementAlertPanel;
