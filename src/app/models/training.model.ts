import { Drill, DrillLevel } from './drill.model';

export interface Training {
  id: string;
  name: string;
  description?: string | null;
  createdBy?: string;
  createdAt: Date;  // When the training plan was created in the system
  scheduledDate?: Date | null;  // When the training is scheduled to occur
  scheduledTime?: string | null;  // Time of day (e.g., "18:00")
  level: DrillLevel;
  drills: TrainingDrill[];
  totalDuration: number;  // Calculated from Training Builder (sum of drill durations)
}

export interface TrainingDrill {
  instanceId?: string;  // Unique ID for this drill instance (UI only, not saved to DB)
  drillId: string;  // Reference to the catalog drill
  duration: number;  // Instance-specific duration (can differ from catalog default)
  notes?: string;
  order: number;
}

export interface BuilderDrill extends TrainingDrill {
  instanceId: string;  // Required for UI state management
  drill?: Drill;  // Reference to the full drill object for UI display
}
