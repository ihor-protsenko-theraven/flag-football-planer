import { Drill, DrillLevel } from './drill.model';

export interface Training {
  id: string;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt: Date;
  level: DrillLevel;
  drills: TrainingDrill[];
  totalDuration: number;
}

export interface TrainingDrill {
  drillId: string;
  duration: number;
  notes?: string;
  order: number;
}

export interface BuilderDrill extends TrainingDrill {
  drill?: Drill;
}
