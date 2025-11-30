export interface Drill {
    id: string;
    name: string;
    description: string;
    duration: number; // minutes
    category: DrillCategory;
    level: DrillLevel;
    imageUrl?: string;
    videoUrl?: string;
}

export type DrillCategory = 'passing' | 'defense' | 'offense' | 'conditioning' | 'warmup' | 'flag_pulling';
export type DrillLevel = 'beginner' | 'intermediate' | 'advanced';

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
