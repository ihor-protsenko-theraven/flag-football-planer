export type CombinationCategory = 'pass_play' | 'run_play' | 'trick_play' | 'defense_scheme';
export type CombinationComplexity = 'basic' | 'intermediate' | 'pro';

export interface CombinationTranslation {
    name: string;
    description: string;
    keyPoints: string[];
}

export interface Combination {
    id: string;
    name: string; // Translatable (fallback or current lang)
    category: CombinationCategory;
    complexity: CombinationComplexity;
    imageUrl: string;
    personnel: string; // e.g., "5v5", "7v7"
    formation: string; // e.g., "Spread", "Bunch"
    relatedDrillIds?: string[];
    // Flattened fields for UI convenience
    description?: string;
    keyPoints?: string[];
}

export interface FirestoreCombination {
    id: string;
    category: CombinationCategory;
    complexity: CombinationComplexity;
    imageUrl: string;
    personnel: string;
    formation: string;
    relatedDrillIds?: string[];
    translations: {
        [lang: string]: CombinationTranslation;
    };
    createdAt?: string;
    updatedAt?: string;
}

export const COMBINATION_CATEGORIES: { value: CombinationCategory; label: string; translationKey: string }[] = [
    { value: 'pass_play', label: 'Pass Play', translationKey: 'COMBINATIONS.CATEGORIES.PASS_PLAY' },
    { value: 'run_play', label: 'Run Play', translationKey: 'COMBINATIONS.CATEGORIES.RUN_PLAY' },
    { value: 'trick_play', label: 'Trick Play', translationKey: 'COMBINATIONS.CATEGORIES.TRICK_PLAY' },
    { value: 'defense_scheme', label: 'Defense Scheme', translationKey: 'COMBINATIONS.CATEGORIES.DEFENSE_SCHEME' },
];

export const COMBINATION_COMPLEXITIES: { value: CombinationComplexity; label: string; translationKey: string }[] = [
    { value: 'basic', label: 'Basic', translationKey: 'COMBINATIONS.COMPLEXITY.BASIC' },
    { value: 'intermediate', label: 'Intermediate', translationKey: 'COMBINATIONS.COMPLEXITY.INTERMEDIATE' },
    { value: 'pro', label: 'Pro', translationKey: 'COMBINATIONS.COMPLEXITY.PRO' },
];
