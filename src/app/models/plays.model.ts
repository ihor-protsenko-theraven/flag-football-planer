export type PlayCategory = 'pass_play' | 'run_play' | 'trick_play' | 'defense_scheme';
export type PlayComplexity = 'basic' | 'intermediate' | 'pro';

export interface PlayTranslation {
  name: string;
  description: string;
  keyPoints: string[];
}

export interface Play {
  id: string;
  name: string; // Translatable (fallback or current lang)
  category: PlayCategory;
  complexity: PlayComplexity;
  imageUrl: string;
  personnel: string; // e.g., "5v5", "7v7"
  formation: string; // e.g., "Spread", "Bunch"
  relatedDrillIds?: string[];
  // Flattened fields for UI convenience
  description?: string;
  keyPoints?: string[];
  videoUrl?: string;
}

export interface FirestorePlays {
  id: string;
  category: PlayCategory;
  complexity: PlayComplexity;
  imageUrl: string;
  videoUrl?: string; // Optional video
  personnel: string;
  formation: string;
  relatedDrillIds?: string[];
  translations: {
    [lang: string]: PlayTranslation;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const PLAYS_CATEGORIES: { value: PlayCategory; label: string; translationKey: string }[] = [
  { value: 'pass_play', label: 'Pass Play', translationKey: 'COMBINATIONS.CATEGORIES.PASS_PLAY' },
  { value: 'run_play', label: 'Run Play', translationKey: 'COMBINATIONS.CATEGORIES.RUN_PLAY' },
  { value: 'trick_play', label: 'Trick Play', translationKey: 'COMBINATIONS.CATEGORIES.TRICK_PLAY' },
  { value: 'defense_scheme', label: 'Defense Scheme', translationKey: 'COMBINATIONS.CATEGORIES.DEFENSE_SCHEME' },
];

export const PLAYS_COMPLEXITIES: { value: PlayComplexity; label: string; translationKey: string }[] = [
  { value: 'basic', label: 'Basic', translationKey: 'COMBINATIONS.COMPLEXITY.BASIC' },
  { value: 'intermediate', label: 'Intermediate', translationKey: 'COMBINATIONS.COMPLEXITY.INTERMEDIATE' },
  { value: 'pro', label: 'Pro', translationKey: 'COMBINATIONS.COMPLEXITY.PRO' },
];

export const PLAYS_PERSONNEL: { value: string; label: string }[] = [
  { value: '5v5', label: '5 vs 5' },
  { value: '4v4', label: '4 vs 4' },
  { value: '7v7', label: '7 vs 7' }
];
