import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm transition-all duration-300 ease-in-out transform animate-slide-in-right max-w-sm"
          [class]="getToastClasses(toast.type)"
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            @switch (toast.type) {
              @case ('success') {
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              }
              @case ('error') {
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              }
              @case ('info') {
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              }
            }
          </div>

          <!-- Message -->
          <div class="flex-1 text-sm font-medium">
            {{ toast.message }}
          </div>

          <!-- Close button -->
          <button
            (click)="dismissToast(toast.id)"
            class="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
            [class]="getCloseButtonClasses(toast.type)"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in-right {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slide-out-right {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    .animate-slide-in-right {
      animation: slide-in-right 0.3s ease-out;
    }

    .animate-slide-out-right {
      animation: slide-out-right 0.3s ease-in;
    }
  `]
})
export class ToastComponent {
  readonly toastService = inject(ToastService);

  /**
   * Get CSS classes for toast based on type
   */
  getToastClasses(type: Toast['type']): string {
    const baseClasses = 'border';

    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50/95 border-green-200 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50/95 border-red-200 text-red-800`;
      case 'info':
        return `${baseClasses} bg-blue-50/95 border-blue-200 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-50/95 border-gray-200 text-gray-800`;
    }
  }

  /**
   * Get CSS classes for close button based on toast type
   */
  getCloseButtonClasses(type: Toast['type']): string {
    switch (type) {
      case 'success':
        return 'text-green-600 hover:text-green-800';
      case 'error':
        return 'text-red-600 hover:text-red-800';
      case 'info':
        return 'text-blue-600 hover:text-blue-800';
      default:
        return 'text-gray-600 hover:text-gray-800';
    }
  }

  /**
   * Dismiss a toast manually
   */
  dismissToast(id: string): void {
    this.toastService.dismiss(id);
  }
}
