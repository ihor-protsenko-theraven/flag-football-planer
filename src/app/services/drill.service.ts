import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Drill, DrillCategory, DrillLevel } from '../models/drill.model';
import { TranslateService } from '@ngx-translate/core';
import mockDrillsEn from '../../assets/data/mock-drills-en.json';
import mockDrillsUa from '../../assets/data/mock-drills-ua.json';

@Injectable({
    providedIn: 'root'
})
export class DrillService {
    private drillsSubject = new BehaviorSubject<Drill[]>(mockDrillsEn as Drill[]);
    public drills$ = this.drillsSubject.asObservable();

    constructor(private translate: TranslateService) {
        // Load initial data based on current language
        this.loadDrillsForLanguage(this.translate.currentLang ?? this.translate.defaultLang ?? 'en');

        // Subscribe to language changes
        this.translate.onLangChange.subscribe(event => {
            this.loadDrillsForLanguage(event.lang);
        });
    }

    private loadDrillsForLanguage(lang: string): void {
        let drills: Drill[];

        if (lang === 'uk') {
            drills = mockDrillsUa as Drill[];
        } else {
            drills = mockDrillsEn as Drill[];
        }

        this.drillsSubject.next(drills);
    }

    getDrills(): Observable<Drill[]> {
        return this.drills$;
    }

    getDrillById(id: string): Observable<Drill | undefined> {
        return this.drills$.pipe(
            map(drills => drills.find(d => d.id === id))
        );
    }

    searchDrills(query: string): Observable<Drill[]> {
        const lowerQuery = query.toLowerCase();
        return this.drills$.pipe(
            map(drills => drills.filter(drill =>
                drill.name.toLowerCase().includes(lowerQuery) ||
                drill.description.toLowerCase().includes(lowerQuery)
            ))
        );
    }

    filterDrills(category?: DrillCategory, level?: DrillLevel): Observable<Drill[]> {
        return this.drills$.pipe(
            map(drills => {
                let filtered = [...drills];

                if (category) {
                    filtered = filtered.filter(drill => drill.category === category);
                }

                if (level) {
                    filtered = filtered.filter(drill => drill.level === level);
                }

                return filtered;
            })
        );
    }

    filterAndSearchDrills(
        searchQuery?: string,
        category?: DrillCategory,
        level?: DrillLevel
    ): Observable<Drill[]> {
        return this.drills$.pipe(
            map(drills => {
                let filtered = [...drills];

                if (searchQuery) {
                    const lowerQuery = searchQuery.toLowerCase();
                    filtered = filtered.filter(drill =>
                        drill.name.toLowerCase().includes(lowerQuery) ||
                        drill.description.toLowerCase().includes(lowerQuery)
                    );
                }

                if (category) {
                    filtered = filtered.filter(drill => drill.category === category);
                }

                if (level) {
                    filtered = filtered.filter(drill => drill.level === level);
                }

                return filtered;
            })
        );
    }
}
