export type DrillCategory = 'passing' | 'defense' | 'offense' | 'conditioning' | 'warmup' | 'flag_pulling';
export type DrillLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Technical translations stored in Firestore
 */
export interface DrillTranslations {
  name: string;
  description: string;
  instructions?: string[];
  coachingTips?: string[];
}

/**
 * Shared fields that are not translated
 */
export interface BaseDrill {
  id: string;
  duration: number; // minutes
  category: DrillCategory;
  level: DrillLevel;
  imageUrl?: string;
  videoUrl?: string;
  equipment?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * The structure of a document in Firestore
 */
export interface FirestoreDrill extends BaseDrill {
  translations: {
    en: DrillTranslations;
    uk: DrillTranslations;
  };
}

/**
 * The flattened structure for the UI (active language only)
 */
export interface Drill extends BaseDrill {
  name: string;
  description: string;
  instructions?: string[];
  coachingTips?: string[];
}

export const DRILL_CATEGORIES: { value: DrillCategory; label: string; translationKey: string }[] = [
  { value: 'passing', label: 'Passing', translationKey: 'DRILL.CATEGORIES.PASSING' },
  { value: 'defense', label: 'Defense', translationKey: 'DRILL.CATEGORIES.DEFENSE' },
  { value: 'offense', label: 'Offense', translationKey: 'DRILL.CATEGORIES.OFFENSE' },
  { value: 'conditioning', label: 'Conditioning', translationKey: 'DRILL.CATEGORIES.CONDITIONING' },
  { value: 'warmup', label: 'Warm-up', translationKey: 'DRILL.CATEGORIES.WARMUP' },
  { value: 'flag_pulling', label: 'Flag Pulling', translationKey: 'DRILL.CATEGORIES.FLAG_PULLING' },
];

export const DRILL_LEVELS: { value: DrillLevel; label: string; translationKey: string }[] = [
  { value: 'beginner', label: 'Beginner', translationKey: 'DRILL.LEVELS.BEGINNER' },
  { value: 'intermediate', label: 'Intermediate', translationKey: 'DRILL.LEVELS.INTERMEDIATE' },
  { value: 'advanced', label: 'Advanced', translationKey: 'DRILL.LEVELS.ADVANCED' },
];
