import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts = signal<Toast[]>([]);

  // Public readonly signal for components to subscribe to
  public toasts = this._toasts.asReadonly();

  constructor() {}

  /**
   * Show a toast notification
   * @param message The message to display
   * @param type The type of toast (success, error, info)
   * @param duration Duration in milliseconds (default: 3000)
   */
  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000): void {
    const id = this.generateId();
    const toast: Toast = {
      id,
      message,
      type,
      duration
    };

    // Add toast to the list
    this._toasts.update(toasts => [...toasts, toast]);

    // Auto-dismiss after specified duration
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  /**
   * Show a success toast
   * @param message The success message
   * @param duration Duration in milliseconds (default: 3000)
   */
  success(message: string, duration: number = 3000): void {
    this.show(message, 'success', duration);
  }

  /**
   * Show an error toast
   * @param message The error message
   * @param duration Duration in milliseconds (default: 4000)
   */
  error(message: string, duration: number = 4000): void {
    this.show(message, 'error', duration);
  }

  /**
   * Show an info toast
   * @param message The info message
   * @param duration Duration in milliseconds (default: 3000)
   */
  info(message: string, duration: number = 3000): void {
    this.show(message, 'info', duration);
  }

  /**
   * Dismiss a specific toast by ID
   * @param id The ID of the toast to dismiss
   */
  dismiss(id: string): void {
    this._toasts.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this._toasts.set([]);
  }

  /**
   * Generate a unique ID for toasts
   */
  private generateId(): string {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
