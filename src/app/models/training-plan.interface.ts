import { TrainingDrill } from './training.model';
import { DrillLevel } from './drill.model';

export interface TrainingPlan {
  id?: string;
  name: string;
  description?: string | null;
  createdBy?: string;
  createdAt: string;
  scheduledDate?: string | null;
  scheduledTime?: string | null;
  level?: DrillLevel;
  drills: TrainingDrill[];
  totalDuration: number;
}

export const collectionName = 'training-plans';
