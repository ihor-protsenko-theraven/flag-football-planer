import { Observable } from 'rxjs';

/**
 * Standard interface for CRUD operations in Firebase-backed services.
 * T corresponds to the Firestore model (e.g., FirestoreDrill, FirestorePlays).
 */
export interface CrudService<T> {
    /** Returns a real-time stream of all items */
    getAllList(): Observable<T[]>;

    /** Returns an item by ID (Observable for onSnapshot support) */
    getById(id: string): Observable<T | undefined>;

    /** Adds a new item and returns its generated ID */
    add(item: Omit<T, 'id'>): Promise<string>;

    /** Updates an existing item */
    update(id: string, item: Partial<T>): Promise<void>;

    /** Deletes an item */
    delete(id: string): Promise<void>;
}
