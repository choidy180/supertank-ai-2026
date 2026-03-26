export type EquipmentHealth = 'normal' | 'warning' | 'critical';
export type ReplacementState = 'stable' | 'due-soon' | 'replace-now';
export type InspectionLevel = 'normal' | 'warning' | 'critical';
export type CoordinateOrigin = 'top-left' | 'bottom-left';
export type Tone = 'green' | 'amber' | 'red';

export interface FireEquipment {
  id: string;
  name: string;
  x: number;
  y: number;
  health: EquipmentHealth;
  replacementState: ReplacementState;
  pressure: '정상' | '주의' | '미달';
  installSpot: string;
  lastInspection: string;
  nextReplacement: string;
  note: string;
}

export interface FactoryZone {
  id: string;
  name: string;
  floor: string;
  width: number;
  height: number;
  coordinateOrigin: CoordinateOrigin;
  equipments: FireEquipment[];
}

export interface InspectionRecord {
  id: string;
  date: string;
  timeRange: string;
  level: InspectionLevel;
  zoneId: string;
  zoneName: string;
  equipmentId: string;
  equipmentName: string;
  inspector: string;
  summary: string;
  abnormality: string;
  action: string;
  detailTitle: string;
  details: string[];
}

export interface FlattenedEquipment extends FireEquipment {
  zoneId: string;
  zoneName: string;
  zoneFloor: string;
  zoneWidth: number;
  zoneHeight: number;
  coordinateOrigin: CoordinateOrigin;
}
