export type CheckpointStatus = 'ok' | 'warning' | 'error' | 'idle';
export type ActiveCheckpointStatus = Exclude<CheckpointStatus, 'idle'>;
export type LogLevel = 'ok' | 'warning' | 'error';
export type LogFilter = 'all' | LogLevel;

export interface TimeSlot {
  id: string;
  label: string;
  caption: string;
}

export interface Checkpoint {
  id: string;
  code: string;
  label: string;
  status: CheckpointStatus;
  inspector: string;
  lastChecked: string;
  note: string;
}

export interface ProductionLine {
  id: string;
  name: string;
  shift: string;
  checkpoints: Checkpoint[];
}

export interface InspectionLog {
  id: string;
  time: string;
  slotId: string;
  lineId: string;
  lineName: string;
  checkpointId: string;
  checkpointLabel: string;
  level: LogLevel;
  title: string;
  detail: string;
  inspector: string;
}

export interface DashboardState {
  lines: ProductionLine[];
  logs: InspectionLog[];
  selectedLineId: string;
  selectedCheckpointId: string;
  selectedTimeSlotId: string;
  logFilter: LogFilter;
  autoRun: boolean;
}

export type DashboardAction =
  | {
      type: 'select-line';
      lineId: string;
    }
  | {
      type: 'select-checkpoint';
      lineId: string;
      checkpointId: string;
    }
  | {
      type: 'select-time-slot';
      slotId: string;
    }
  | {
      type: 'set-log-filter';
      filter: LogFilter;
    }
  | {
      type: 'toggle-auto-run';
    }
  | {
      type: 'manual-update';
      lineId: string;
      checkpointId: string;
      status: ActiveCheckpointStatus;
    }
  | {
      type: 'auto-random-update';
    };
