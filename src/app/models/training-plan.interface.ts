import { TrainingDrill } from './training.model';
import { DrillLevel } from './drill.model';

export interface TrainingPlan {
  id?: string;
  name: string;
  description?: string;
  createdBy?: string;
  createdAt: string;
  level?: DrillLevel;
  drills: TrainingDrill[];
  totalDuration: number;
}

export const collectionName = 'training-plans';
