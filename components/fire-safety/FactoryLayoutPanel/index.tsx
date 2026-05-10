'use client';

import type { DragEvent, ReactNode } from 'react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import {
  getMarkerPosition,
  getMarkerTone,
  formatCoordinateOrigin,
} from '../model/helpers';
import type { FactoryZone, FlattenedEquipment } from '../model/types';
import {
  AxisCorner,
  AxisLabelX,
  AxisLabelY,
  CenterPanel,
  FloatingMarkerTooltip,
  GridLayer,
  LegendDot,
  LegendGroup,
  LegendItem,
  LegendMeta,
  LegendRow,
  MapArea,
  MarkerButton,
  MarkerIcon,
  MarkerPreviewBody,
  MarkerPreviewEyebrow,
  MarkerPreviewHeader,
  MarkerPreviewPiP,
  MarkerPreviewPlaceholder,
  MarkerPreviewTitle,
  MarkerPreviewVideo,
  MarkerTooltipMeta,
  MarkerTooltipTitle,
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
  ZoneTop,
} from './styles';

interface FactoryLayoutPanelProps {
  factoryZones: FactoryZone[];
  allEquipments: FlattenedEquipment[];
  zoneInspectionCounts: Record<string, number>;
  selectedEquipment: FlattenedEquipment;
  onSelectEquipment: (equipmentId: string) => void;

  /**
   * 마커 hover 시 오른쪽 아래 PIP에 띄울 기본 로컬 영상 경로입니다.
   * 예: /videos/factory-preview.mp4
   */
  previewVideoSrc?: string;

  /**
   * 설비별로 다른 로컬 영상을 연결하고 싶을 때 사용합니다.
   * 반환값이 없으면 previewVideoSrc를 fallback으로 사용합니다.
   */
  getPreviewVideoSrc?: (equipment: FlattenedEquipment) => string | undefined;

  /**
   * 드래그앤드롭으로 구역 카드 순서가 바뀌었을 때 부모에 알려주고 싶으면 연결합니다.
   * 연결하지 않아도 화면 내 순서 변경은 동작합니다.
   */
  onChangeZoneOrder?: (zoneIds: string[]) => void;

  children?: ReactNode;
}

type TooltipPosition = {
  left: number;
  top: number;
};

const getNextZoneOrder = (previousOrder: string[], nextZoneIds: string[]) => {
  const remainedZoneIds = previousOrder.filter((zoneId) =>
    nextZoneIds.includes(zoneId),
  );
  const appendedZoneIds = nextZoneIds.filter(
    (zoneId) => !remainedZoneIds.includes(zoneId),
  );

  return [...remainedZoneIds, ...appendedZoneIds];
};

const isSameOrder = (a: string[], b: string[]) => {
  return a.length === b.length && a.every((item, index) => item === b[index]);
};

const FactoryLayoutPanel = ({
  factoryZones,
  allEquipments,
  zoneInspectionCounts,
  selectedEquipment,
  onSelectEquipment,
  previewVideoSrc,
  getPreviewVideoSrc,
  onChangeZoneOrder,
  children,
}: FactoryLayoutPanelProps) => {
  const markerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const latestZoneOrderRef = useRef<string[]>(factoryZones.map((zone) => zone.id));

  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [hoveredEquipmentId, setHoveredEquipmentId] = useState<string | null>(
    null,
  );
  const [tooltipPosition, setTooltipPosition] =
    useState<TooltipPosition | null>(null);

  const [zoneOrder, setZoneOrder] = useState<string[]>(() =>
    factoryZones.map((zone) => zone.id),
  );
  const [draggedZoneId, setDraggedZoneId] = useState<string | null>(null);
  const [dragOverZoneId, setDragOverZoneId] = useState<string | null>(null);

  const factoryZoneIds = useMemo(() => {
    return factoryZones.map((zone) => zone.id);
  }, [factoryZones]);

  const orderedFactoryZones = useMemo(() => {
    const zoneMap = new Map(factoryZones.map((zone) => [zone.id, zone]));

    return zoneOrder
      .map((zoneId) => zoneMap.get(zoneId))
      .filter((zone): zone is FactoryZone => Boolean(zone));
  }, [factoryZones, zoneOrder]);

  const hoveredEquipment = useMemo(() => {
    if (!hoveredEquipmentId) {
      return null;
    }

    return (
      allEquipments.find((equipment) => equipment.id === hoveredEquipmentId) ??
      null
    );
  }, [allEquipments, hoveredEquipmentId]);

  const activeTooltipEquipment = hoveredEquipment ?? selectedEquipment;

  const activePreviewVideoSrc = hoveredEquipment
    ? getPreviewVideoSrc?.(hoveredEquipment) ?? previewVideoSrc
    : undefined;

  const updateTooltipPosition = useCallback(() => {
    const markerElement = markerRefs.current[activeTooltipEquipment.id];

    if (!markerElement) {
      setTooltipPosition(null);
      return;
    }

    const markerRect = markerElement.getBoundingClientRect();

    setTooltipPosition({
      left: markerRect.left + markerRect.width / 2,
      top: markerRect.top - 12,
    });
  }, [activeTooltipEquipment.id]);

  const moveZone = useCallback((sourceZoneId: string, targetZoneId: string) => {
    if (sourceZoneId === targetZoneId) {
      return;
    }

    setZoneOrder((previousOrder) => {
      const sourceIndex = previousOrder.indexOf(sourceZoneId);
      const targetIndex = previousOrder.indexOf(targetZoneId);

      if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
        return previousOrder;
      }

      const nextOrder = [...previousOrder];
      const [movedZoneId] = nextOrder.splice(sourceIndex, 1);

      nextOrder.splice(targetIndex, 0, movedZoneId);
      latestZoneOrderRef.current = nextOrder;

      return nextOrder;
    });
  }, []);

  const handleZoneDragStart = (
    event: DragEvent<HTMLDivElement>,
    zoneId: string,
  ) => {
    const targetElement = event.target as HTMLElement | null;

    if (targetElement?.closest('[data-marker-button="true"]')) {
      event.preventDefault();
      return;
    }

    latestZoneOrderRef.current = zoneOrder;
    setDraggedZoneId(zoneId);
    setDragOverZoneId(zoneId);

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', zoneId);
  };

  const handleZoneDragEnter = (
    event: DragEvent<HTMLDivElement>,
    targetZoneId: string,
  ) => {
    event.preventDefault();
    setDragOverZoneId(targetZoneId);

    if (!draggedZoneId) {
      return;
    }

    moveZone(draggedZoneId, targetZoneId);
  };

  const handleZoneDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleZoneDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setDraggedZoneId(null);
    setDragOverZoneId(null);
    onChangeZoneOrder?.(latestZoneOrderRef.current);
  };

  const handleZoneDragEnd = () => {
    setDraggedZoneId(null);
    setDragOverZoneId(null);
  };

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    setZoneOrder((previousOrder) => {
      const nextOrder = getNextZoneOrder(previousOrder, factoryZoneIds);

      if (isSameOrder(previousOrder, nextOrder)) {
        return previousOrder;
      }

      latestZoneOrderRef.current = nextOrder;
      return nextOrder;
    });
  }, [factoryZoneIds]);

  useEffect(() => {
    latestZoneOrderRef.current = zoneOrder;
  }, [zoneOrder]);

  useEffect(() => {
    updateTooltipPosition();
  }, [updateTooltipPosition, zoneOrder]);

  useEffect(() => {
    updateTooltipPosition();

    window.addEventListener('resize', updateTooltipPosition);
    window.addEventListener('scroll', updateTooltipPosition, true);

    return () => {
      window.removeEventListener('resize', updateTooltipPosition);
      window.removeEventListener('scroll', updateTooltipPosition, true);
    };
  }, [updateTooltipPosition]);

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
        {orderedFactoryZones.map((zone) => {
          const zoneEquipments = allEquipments.filter(
            (equipment) => equipment.zoneId === zone.id,
          );
          const zoneLogs = zoneInspectionCounts[zone.id] ?? 0;
          const isZoneSelected = selectedEquipment.zoneId === zone.id;
          const isDragging = draggedZoneId === zone.id;
          const isDragOver = dragOverZoneId === zone.id && draggedZoneId !== zone.id;

          return (
            <ZoneCard
              key={zone.id}
              $selected={isZoneSelected}
              $dragging={isDragging}
              $dragOver={isDragOver}
              draggable
              aria-grabbed={isDragging}
              onDragStart={(event) => handleZoneDragStart(event, zone.id)}
              onDragEnter={(event) => handleZoneDragEnter(event, zone.id)}
              onDragOver={handleZoneDragOver}
              onDrop={handleZoneDrop}
              onDragEnd={handleZoneDragEnd}
            >
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
                      ref={(node) => {
                        markerRefs.current[equipment.id] = node;
                      }}
                      type="button"
                      data-marker-button="true"
                      $tone={tone}
                      $selected={isSelected}
                      style={position}
                      draggable={false}
                      aria-describedby={
                        isSelected ? `equipment-tooltip-${equipment.id}` : undefined
                      }
                      onMouseEnter={() => setHoveredEquipmentId(equipment.id)}
                      onMouseLeave={() => {
                        setHoveredEquipmentId((currentEquipmentId) =>
                          currentEquipmentId === equipment.id
                            ? null
                            : currentEquipmentId,
                        );
                      }}
                      onFocus={() => setHoveredEquipmentId(equipment.id)}
                      onBlur={() => {
                        setHoveredEquipmentId((currentEquipmentId) =>
                          currentEquipmentId === equipment.id
                            ? null
                            : currentEquipmentId,
                        );
                      }}
                      onDragStart={(event) => event.preventDefault()}
                      onClick={(event) => {
                        event.stopPropagation();
                        onSelectEquipment(equipment.id);
                      }}
                    >
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
                <span>좌표 원점 {formatCoordinateOrigin(zone.coordinateOrigin)}</span>
              </ZoneFooter>
            </ZoneCard>
          );
        })}
      </ZoneGrid>

      {children}

      {portalRoot && tooltipPosition &&
        createPortal(
          <FloatingMarkerTooltip
            id={`equipment-tooltip-${activeTooltipEquipment.id}`}
            style={{
              left: tooltipPosition.left,
              top: tooltipPosition.top,
            }}
          >
            <MarkerTooltipTitle>
              {activeTooltipEquipment.name}
            </MarkerTooltipTitle>
            <MarkerTooltipMeta>
              x {activeTooltipEquipment.x}m / y {activeTooltipEquipment.y}m
            </MarkerTooltipMeta>
          </FloatingMarkerTooltip>,
          portalRoot,
        )}

      {portalRoot && hoveredEquipment &&
        createPortal(
          <MarkerPreviewPiP aria-live="polite">
            <MarkerPreviewHeader>
              <MarkerPreviewEyebrow>Local Preview</MarkerPreviewEyebrow>
              <MarkerPreviewTitle>{hoveredEquipment.name}</MarkerPreviewTitle>
            </MarkerPreviewHeader>

            <MarkerPreviewBody>
              {activePreviewVideoSrc ? (
                <MarkerPreviewVideo
                  src={activePreviewVideoSrc}
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
                <MarkerPreviewPlaceholder>
                  로컬 영상 소스 대기 중
                </MarkerPreviewPlaceholder>
              )}
            </MarkerPreviewBody>
          </MarkerPreviewPiP>,
          portalRoot,
        )}
    </CenterPanel>
  );
};

export default FactoryLayoutPanel;
