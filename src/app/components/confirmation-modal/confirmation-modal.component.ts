import {Component, HostListener, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ConfirmationService} from '../../services/confirmation.service';
import {ConfirmData} from '../../models/confirm-data.interface';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    @if (isVisible()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
        (click)="onBackdropClick($event)"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm"></div>

        <!-- Modal -->
        <div
          class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full transform transition-all border border-transparent dark:border-slate-800"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="'modal-title'"
          [attr.aria-describedby]="'modal-description'"
        >
          <!-- Header -->
          <div class="px-6 pt-6 pb-4">
            <h3
              id="modal-title"
              class="text-xl font-bold text-slate-900 dark:text-white tracking-tight"
            >
              {{ confirmData()?.title }}
            </h3>
          </div>

          <!-- Body -->
          <div class="px-6 pb-6">
            <p
              id="modal-description"
              class="text-slate-600 dark:text-slate-400 leading-relaxed"
            >
              {{ confirmData()?.message }}
            </p>
          </div>

          <!-- Footer -->
          <div class="px-6 pb-6 flex items-center justify-end space-x-3">
            <button
              (click)="onCancel()"
              class="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
            >
              {{ confirmData()?.cancelText || ('CONFIRMATION.CANCEL' | translate) }}
            </button>
            <button
              (click)="onConfirm()"
              [class]="getConfirmButtonClass()"
            >
              {{ confirmData()?.confirmText || ('CONFIRMATION.CONFIRM' | translate) }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .animate-fade-in {
      animation: fade-in 0.1s ease-out;
    }
  `]
})
export class ConfirmationModalComponent implements OnInit {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly translate = inject(TranslateService);

  isVisible = signal(false);
  confirmData = signal<ConfirmData | null>(null);

  private focusableElements: HTMLElement[] = [];
  private lastFocusedElement: HTMLElement | null = null;

  ngOnInit(): void {
    this.confirmationService.isVisible$.subscribe(isVisible => {
      this.isVisible.set(isVisible);
      if (isVisible) {
        this.lastFocusedElement = document.activeElement as HTMLElement;
        setTimeout(() => this.setupFocusTrap(), 100);
      } else {
        this.restoreFocus();
      }
    });

    this.confirmationService.confirmData$.subscribe(data => {
      this.confirmData.set(data);
    });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: any): void {
    if (this.isVisible()) {
      event.preventDefault();
      this.onCancel();
    }
  }

  @HostListener('document:keydown.tab', ['$event'])
  onTabKey(event: any): void {
    if (!this.isVisible() || this.focusableElements.length === 0) {
      return;
    }

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  onConfirm(): void {
    this.confirmationService.resolve(true);
  }

  onCancel(): void {
    this.confirmationService.resolve(false);
  }

  getConfirmButtonClass(): string {
    const baseClass = 'px-5 py-2.5 rounded-xl font-bold text-white transition-all duration-200 focus:outline-none focus:ring-2';
    const data = this.confirmData();

    if (data?.isDestructive) {
      return `${baseClass} bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 shadow-lg shadow-red-500/30 focus:ring-red-500/50`;
    }
    return `${baseClass} bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-lg shadow-green-500/30 focus:ring-green-500/50`;
  }

  private setupFocusTrap(): void {
    const modalElement = document.querySelector('[role="dialog"]');
    if (!modalElement) return;

    this.focusableElements = Array.from(
      modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    if (this.focusableElements.length > 0) {
      // Focus the confirm button by default (last button)
      this.focusableElements[this.focusableElements.length - 1].focus();
    }
  }

  private restoreFocus(): void {
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }
}
