import { InjectionToken } from '@angular/core';

export interface PdfThemeConfig {
    headerColor: string;
    accentColor: string;
    sectionHeaderColor: string;
    labelColor: string;
    descriptionColor: string;
    notesColor: string;
    metaColor: string;
    borderColor: string;
    fontSize: {
        title: number;
        sectionHeader: number;
        label: number;
        value: number;
        drillNumber: number;
        drillName: number;
        drillMeta: number;
        drillDescription: number;
        drillNotes: number;
        duration: number;
    };
    margins: {
        page: [number, number, number, number];
        header: [number, number, number, number];
        trainingInfo: [number, number, number, number];
        sectionTitle: [number, number, number, number];
        drillItem: [number, number, number, number];
        separator: [number, number, number, number];
    };
    defaultFont: string;
}

export const PDF_THEME_CONFIG = new InjectionToken<PdfThemeConfig>('PDF_THEME_CONFIG');

export const DEFAULT_PDF_THEME: PdfThemeConfig = {
    headerColor: '#166534',
    accentColor: '#22c55e',
    sectionHeaderColor: '#166534',
    labelColor: '#6b7280',
    descriptionColor: '#4b5563',
    notesColor: '#3b82f6',
    metaColor: '#6b7280',
    borderColor: '#e5e7eb',
    fontSize: {
        title: 24,
        sectionHeader: 16,
        label: 10,
        value: 14,
        drillNumber: 18,
        drillName: 14,
        drillMeta: 10,
        drillDescription: 11,
        drillNotes: 10,
        duration: 12,
    },
    margins: {
        page: [40, 60, 40, 60],
        header: [0, 0, 0, 10],
        trainingInfo: [0, 0, 0, 30],
        sectionTitle: [0, 0, 0, 15],
        drillItem: [0, 0, 0, 20],
        separator: [0, 0, 0, 20],
    },
    defaultFont: 'Roboto',
};
