import {Drill} from './drill.model';

export interface Training {
  id: string;
  name: string;
  createdBy?: string;
  createdAt: Date;
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
