import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Drill, DrillCategory, DrillLevel } from '../models/drill.model';
import mockDrills from '../../assets/data/mock-drills-en.json';

@Injectable({
    providedIn: 'root'
})
export class DrillService {
    private drills: Drill[] = mockDrills as Drill[];

    constructor() { }

    getDrills(): Observable<Drill[]> {
        return of(this.drills);
    }

    getDrillById(id: string): Observable<Drill | undefined> {
        const drill = this.drills.find(d => d.id === id);
        return of(drill);
    }

    searchDrills(query: string): Observable<Drill[]> {
        const lowerQuery = query.toLowerCase();
        const filtered = this.drills.filter(drill =>
            drill.name.toLowerCase().includes(lowerQuery) ||
            drill.description.toLowerCase().includes(lowerQuery)
        );
        return of(filtered);
    }

    filterDrills(category?: DrillCategory, level?: DrillLevel): Observable<Drill[]> {
        let filtered = [...this.drills];

        if (category) {
            filtered = filtered.filter(drill => drill.category === category);
        }

        if (level) {
            filtered = filtered.filter(drill => drill.level === level);
        }

        return of(filtered);
    }

    filterAndSearchDrills(
        searchQuery?: string,
        category?: DrillCategory,
        level?: DrillLevel
    ): Observable<Drill[]> {
        let filtered = [...this.drills];

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

        return of(filtered);
    }
}
