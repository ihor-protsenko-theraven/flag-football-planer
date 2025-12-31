import { inject, Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions, Content, StyleDictionary } from 'pdfmake/interfaces';

import { Training } from '../models/training.model';
import { Drill } from '../models/drill.model';
import { PDF_THEME_CONFIG } from '../core/config/pdf-theme.config';

// Initialize pdfMake with fonts
(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).default?.pdfMake?.vfs;

@Injectable({
    providedIn: 'root'
})
export class PdfExportService {
    private readonly config = inject(PDF_THEME_CONFIG);

    exportTrainingToPDF(training: Training, drills: Drill[]): void {
        const drillMap = new Map(drills.map(d => [d.id, d]));

        const documentDefinition: TDocumentDefinitions = {
            pageSize: 'A4',
            pageMargins: this.config.margins.page,
            content: [
                // Header
                {
                    text: 'FLAG FOOTBALL TRAINING PLAN',
                    style: 'header',
                    alignment: 'center',
                    margin: this.config.margins.header
                },
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 0,
                            x2: 515, y2: 0,
                            lineWidth: 2,
                            lineColor: this.config.accentColor
                        }
                    ],
                    margin: [0, 0, 0, 20]
                },

                // Training Info
                {
                    columns: [
                        {
                            width: '*',
                            stack: [
                                { text: 'Training Session', style: 'label' },
                                { text: training.name, style: 'value' }
                            ]
                        },
                        {
                            width: '*',
                            stack: [
                                { text: 'Date', style: 'label' },
                                { text: this.formatDate(training.createdAt), style: 'value' }
                            ]
                        },
                        {
                            width: '*',
                            stack: [
                                { text: 'Total Duration', style: 'label' },
                                { text: `${training.totalDuration} minutes`, style: 'value', color: this.config.accentColor, bold: true }
                            ]
                        }
                    ],
                    margin: this.config.margins.trainingInfo
                },

                // Drills Section
                {
                    text: 'DRILLS',
                    style: 'sectionHeader',
                    margin: this.config.margins.sectionTitle
                },

                // Drills Table
                ...this.generateDrillsContent(training, drillMap)
            ],
            styles: this.getStyles(),
            defaultStyle: {
                font: this.config.defaultFont
            }
        };

        pdfMake.createPdf(documentDefinition).download(`${training.name.replace(/\s+/g, '_')}_Training_Plan.pdf`);
    }

    private getStyles(): StyleDictionary {
        return {
            header: {
                fontSize: this.config.fontSize.title,
                bold: true,
                color: this.config.headerColor
            },
            sectionHeader: {
                fontSize: this.config.fontSize.sectionHeader,
                bold: true,
                color: this.config.sectionHeaderColor,
                decoration: 'underline'
            },
            label: {
                fontSize: this.config.fontSize.label,
                color: this.config.labelColor,
                margin: [0, 0, 0, 4]
            },
            value: {
                fontSize: this.config.fontSize.value,
                bold: true
            },
            drillNumber: {
                fontSize: this.config.fontSize.drillNumber,
                bold: true,
                color: this.config.accentColor
            },
            drillName: {
                fontSize: this.config.fontSize.drillName,
                bold: true,
                color: '#1f2937'
            },
            drillMeta: {
                fontSize: this.config.fontSize.drillMeta,
                color: this.config.metaColor,
                margin: [0, 4, 0, 0]
            },
            drillDescription: {
                fontSize: this.config.fontSize.drillDescription,
                color: this.config.descriptionColor,
                margin: [0, 8, 0, 0]
            },
            drillNotes: {
                fontSize: this.config.fontSize.drillNotes,
                italics: true,
                color: this.config.notesColor,
                margin: [0, 6, 0, 0]
            },
            duration: {
                fontSize: this.config.fontSize.duration,
                bold: true,
                color: this.config.accentColor
            }
        };
    }

    private generateDrillsContent(training: Training, drillMap: Map<string, Drill>): Content[] {
        const content: Content[] = [];

        training.drills
            .sort((a, b) => a.order - b.order)
            .forEach((trainingDrill, index) => {
                const drill = drillMap.get(trainingDrill.drillId);

                if (!drill) return;

                // Drill container
                content.push({
                    stack: [
                        // Drill header
                        {
                            columns: [
                                {
                                    width: 40,
                                    text: `${index + 1}.`,
                                    style: 'drillNumber'
                                },
                                {
                                    width: '*',
                                    stack: [
                                        { text: drill.name, style: 'drillName' },
                                        {
                                            text: [
                                                { text: 'Category: ', bold: true },
                                                { text: this.capitalize(drill.category) },
                                                { text: ' | Level: ', bold: true },
                                                { text: this.capitalize(drill.level) }
                                            ],
                                            style: 'drillMeta'
                                        }
                                    ]
                                },
                                {
                                    width: 80,
                                    text: `${trainingDrill.duration} min`,
                                    style: 'duration',
                                    alignment: 'right'
                                }
                            ]
                        },

                        // Description
                        {
                            text: drill.description,
                            style: 'drillDescription'
                        },

                        // Notes (if any)
                        ...(trainingDrill.notes ? [{
                            text: `Notes: ${trainingDrill.notes}`,
                            style: 'drillNotes'
                        }] : [])
                    ],
                    margin: this.config.margins.drillItem
                });

                // Separator line (except for last drill)
                if (index < training.drills.length - 1) {
                    content.push({
                        canvas: [
                            {
                                type: 'line',
                                x1: 0, y1: 0,
                                x2: 515, y2: 0,
                                lineWidth: 0.5,
                                lineColor: this.config.borderColor,
                                dash: { length: 3 }
                            }
                        ],
                        margin: this.config.margins.separator
                    });
                }
            });

        return content;
    }

    private formatDate(date: Date): string {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
