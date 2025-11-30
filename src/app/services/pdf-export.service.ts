import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Training } from '../models/training.model';
import { Drill } from '../models/drill.model';

// Initialize pdfMake with fonts
(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).default?.pdfMake?.vfs;

@Injectable({
    providedIn: 'root'
})
export class PdfExportService {

    constructor() { }

    exportTrainingToPDF(training: Training, drills: Drill[]): void {
        const drillMap = new Map(drills.map(d => [d.id, d]));

        const documentDefinition: any = {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            content: [
                // Header
                {
                    text: 'FLAG FOOTBALL TRAINING PLAN',
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                },
                {
                    canvas: [
                        {
                            type: 'line',
                            x1: 0, y1: 0,
                            x2: 515, y2: 0,
                            lineWidth: 2,
                            lineColor: '#22c55e'
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
                                { text: `${training.totalDuration} minutes`, style: 'value', color: '#22c55e', bold: true }
                            ]
                        }
                    ],
                    margin: [0, 0, 0, 30]
                },

                // Drills Section
                {
                    text: 'DRILLS',
                    style: 'sectionHeader',
                    margin: [0, 0, 0, 15]
                },

                // Drills Table
                ...this.generateDrillsContent(training, drillMap)
            ],
            styles: {
                header: {
                    fontSize: 24,
                    bold: true,
                    color: '#166534'
                },
                sectionHeader: {
                    fontSize: 16,
                    bold: true,
                    color: '#166534',
                    decoration: 'underline'
                },
                label: {
                    fontSize: 10,
                    color: '#6b7280',
                    margin: [0, 0, 0, 4]
                },
                value: {
                    fontSize: 14,
                    bold: true
                },
                drillNumber: {
                    fontSize: 18,
                    bold: true,
                    color: '#22c55e'
                },
                drillName: {
                    fontSize: 14,
                    bold: true,
                    color: '#1f2937'
                },
                drillMeta: {
                    fontSize: 10,
                    color: '#6b7280',
                    margin: [0, 4, 0, 0]
                },
                drillDescription: {
                    fontSize: 11,
                    color: '#4b5563',
                    margin: [0, 8, 0, 0]
                },
                drillNotes: {
                    fontSize: 10,
                    italics: true,
                    color: '#3b82f6',
                    margin: [0, 6, 0, 0]
                },
                duration: {
                    fontSize: 12,
                    bold: true,
                    color: '#22c55e'
                }
            },
            defaultStyle: {
                font: 'Roboto'
            }
        };

        pdfMake.createPdf(documentDefinition).download(`${training.name.replace(/\s+/g, '_')}_Training_Plan.pdf`);
    }

    private generateDrillsContent(training: Training, drillMap: Map<string, Drill>): any[] {
        const content: any[] = [];

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
                            text: `📝 Notes: ${trainingDrill.notes}`,
                            style: 'drillNotes'
                        }] : [])
                    ],
                    margin: [0, 0, 0, 20]
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
                                lineColor: '#e5e7eb',
                                dash: { length: 3 }
                            }
                        ],
                        margin: [0, 0, 0, 20]
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
