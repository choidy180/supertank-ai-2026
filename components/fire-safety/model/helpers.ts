import {
  CoordinateOrigin,
  EquipmentHealth,
  FlattenedEquipment,
  InspectionLevel,
  ReplacementState,
  Tone
} from './types';

export const clamp = (value: number, min = 0, max = 1): number => {
  return Math.min(max, Math.max(min, value));
};

export const getMarkerTone = (
  state: ReplacementState | EquipmentHealth
): Tone => {
  if (state === 'replace-now' || state === 'critical') {
    return 'red';
  }

  if (state === 'due-soon' || state === 'warning') {
    return 'amber';
  }

  return 'green';
};

export const getReplacementLabel = (state: ReplacementState): string => {
  switch (state) {
    case 'stable':
      return '정상';
    case 'due-soon':
      return '교체도래';
    case 'replace-now':
      return '교체필요';
    default:
      return state;
  }
};

export const getHealthLabel = (state: EquipmentHealth): string => {
  switch (state) {
    case 'normal':
      return '점검 정상';
    case 'warning':
      return '주의';
    case 'critical':
      return '위험';
    default:
      return state;
  }
};

export const getInspectionLevelLabel = (
  level: InspectionLevel
): string => {
  switch (level) {
    case 'normal':
      return '정상';
    case 'warning':
      return '주의';
    case 'critical':
      return '위험';
    default:
      return level;
  }
};

export const getInspectionTone = (level: InspectionLevel): Tone => {
  if (level === 'critical') {
    return 'red';
  }

  if (level === 'warning') {
    return 'amber';
  }

  return 'green';
};

export const getMarkerPosition = (
  equipment: FlattenedEquipment
): { left: string; top: string } => {
  const xRatio = clamp(equipment.x / equipment.zoneWidth, 0.06, 0.94);
  const rawYRatio = clamp(equipment.y / equipment.zoneHeight, 0.06, 0.94);
  const mappedY =
    equipment.coordinateOrigin === 'bottom-left' ? 1 - rawYRatio : rawYRatio;

  return {
    left: `${xRatio * 100}%`,
    top: `${clamp(mappedY, 0.06, 0.94) * 100}%`
  };
};

export const formatCoordinateOrigin = (
  origin: CoordinateOrigin
): string => {
  return origin === 'bottom-left' ? '좌하단 기준' : '좌상단 기준';
};
