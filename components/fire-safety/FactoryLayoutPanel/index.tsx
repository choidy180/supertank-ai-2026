import type { ReactNode } from 'react';
import { getMarkerPosition, getMarkerTone, formatCoordinateOrigin } from '../model/helpers';
import { FactoryZone, FlattenedEquipment } from '../model/types';
import {
  AxisCorner,
  AxisLabelX,
  AxisLabelY,
  CenterPanel,
  GridLayer,
  LegendDot,
  LegendGroup,
  LegendItem,
  LegendMeta,
  LegendRow,
  MapArea,
  MarkerButton,
  MarkerIcon,
  MarkerTooltip,
  MarkerTooltipMeta,
  MarkerTooltipTitle,
  PanelCaption,
  PanelHeader,
  PanelTitle,
  PanelTitleGroup,
  ZoneBadge,
  ZoneCard,
  ZoneFooter,
  ZoneGrid,
  ZoneMeta,
  ZoneName,
  ZoneTitleGroup,
  ZoneTop
} from './styles';

interface FactoryLayoutPanelProps {
  factoryZones: FactoryZone[];
  allEquipments: FlattenedEquipment[];
  zoneInspectionCounts: Record<string, number>;
  selectedEquipment: FlattenedEquipment;
  onSelectEquipment: (equipmentId: string) => void;
  children?: ReactNode;
}

const FactoryLayoutPanel = ({
  factoryZones,
  allEquipments,
  zoneInspectionCounts,
  selectedEquipment,
  onSelectEquipment,
  children
}: FactoryLayoutPanelProps) => {
  return (
    <CenterPanel>
      <PanelHeader>
        <PanelTitleGroup>
          <PanelTitle>공장 레이아웃 (소방설비 위치)</PanelTitle>
        </PanelTitleGroup>
      </PanelHeader>

      <LegendRow>
        <LegendGroup>
          <LegendItem>
            <LegendDot $tone="green" />
            정상
          </LegendItem>
          <LegendItem>
            <LegendDot $tone="amber" />
            교체도래
          </LegendItem>
          <LegendItem>
            <LegendDot $tone="red" />
            교체필요
          </LegendItem>
        </LegendGroup>

        <LegendMeta>
          원점 기준: {formatCoordinateOrigin(selectedEquipment.coordinateOrigin)}
          {' · '}
          선택 설비 좌표 x {selectedEquipment.x}m / y {selectedEquipment.y}m
        </LegendMeta>
      </LegendRow>

      <ZoneGrid>
        {factoryZones.map((zone) => {
          const zoneEquipments = allEquipments.filter(
            (equipment) => equipment.zoneId === zone.id
          );
          const zoneLogs = zoneInspectionCounts[zone.id] ?? 0;
          const isZoneSelected = selectedEquipment.zoneId === zone.id;

          return (
            <ZoneCard key={zone.id} $selected={isZoneSelected}>
              <ZoneTop>
                <ZoneTitleGroup>
                  <ZoneName>{zone.name}</ZoneName>
                  <ZoneMeta>
                    {zone.floor} · {zone.width}m × {zone.height}m
                  </ZoneMeta>
                </ZoneTitleGroup>

                <ZoneBadge>{zoneEquipments.length}대 배치</ZoneBadge>
              </ZoneTop>

              <MapArea>
                <GridLayer />

                {zoneEquipments.map((equipment) => {
                  const position = getMarkerPosition(equipment);
                  const tone = getMarkerTone(equipment.replacementState);
                  const isSelected = equipment.id === selectedEquipment.id;

                  return (
                    <MarkerButton
                      key={equipment.id}
                      type="button"
                      $tone={tone}
                      $selected={isSelected}
                      style={position}
                      onClick={() => {
                        onSelectEquipment(equipment.id);
                      }}
                    >
                      <MarkerTooltip $visible={isSelected}>
                        <MarkerTooltipTitle>{equipment.name}</MarkerTooltipTitle>
                        <MarkerTooltipMeta>
                          x {equipment.x}m / y {equipment.y}m
                        </MarkerTooltipMeta>
                      </MarkerTooltip>
                      <MarkerIcon />
                    </MarkerButton>
                  );
                })}

                <AxisLabelX>
                  <span>0m</span>
                  <span>{zone.width}m</span>
                </AxisLabelX>

                <AxisLabelY>
                  <span>{zone.height}m</span>
                  <span>0m</span>
                </AxisLabelY>

                <AxisCorner>(0,0)</AxisCorner>
              </MapArea>

              <ZoneFooter>
                <span>최근 점검 {zoneLogs}건</span>
                <span>
                  좌표 원점 {formatCoordinateOrigin(zone.coordinateOrigin)}
                </span>
              </ZoneFooter>
            </ZoneCard>
          );
        })}
      </ZoneGrid>

      {children}
    </CenterPanel>
  );
};

export default FactoryLayoutPanel;
