import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ConfirmData} from '../models/confirm-data.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private confirmDataSubject = new Subject<ConfirmData | null>();
  private isVisibleSubject = new Subject<boolean>();
  private resolverSubject = new Subject<boolean>();

  // Observable API (для backward compatibility з старим кодом)
  public readonly confirmData$ = this.confirmDataSubject.asObservable();
  public readonly isVisible$ = this.isVisibleSubject.asObservable();

  confirm(data: ConfirmData): Observable<boolean> {
    return new Observable<boolean>(observer => {
      // Показуємо модальне вікно
      this.confirmDataSubject.next(data);
      this.isVisibleSubject.next(true);

      // Слухаємо на результат
      const subscription = this.resolverSubject.subscribe(value => {
        observer.next(value);
        observer.complete();
      });

      // Cleanup
      return () => {
        subscription.unsubscribe();
        this.close();
      };
    });
  }

  resolve(confirmed: boolean): void {
    this.resolverSubject.next(confirmed);
    this.close();
  }

  private close(): void {
    this.isVisibleSubject.next(false);
    this.confirmDataSubject.next(null);
  }
}
