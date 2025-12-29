import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-translation-tabs',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="space-y-6 mt-6">
      <!-- Tabs Header -->
      <div class="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full sm:w-fit">
        @for (lang of languages; track lang) {
          <button (click)="onTabClick(lang)"
                  type="button"
                  [class.bg-white]="activeTab === lang"
                  [class.dark:bg-slate-700]="activeTab === lang"
                  [class.shadow-sm]="activeTab === lang"
                  [class.text-indigo-600]="activeTab === lang"
                  [class.dark:text-indigo-400]="activeTab === lang"
                  [class.text-slate-500]="activeTab !== lang"
                  class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 sm:py-2 rounded-xl text-sm font-bold transition-all">
            {{ lang.toUpperCase() }}
            @if (hasErrors(lang)) {
              <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            }
          </button>
        }
      </div>

      <!-- Tab Content Wrapper -->
      <div class="animate-fade-in">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class TranslationTabsComponent {
  @Input({required: true}) translationsGroup!: FormGroup;
  @Input({required: true}) activeTab: 'uk' | 'en' = 'uk';

  @Output() tabChange = new EventEmitter<'uk' | 'en'>();

  readonly languages: ('uk' | 'en')[] = ['uk', 'en'];

  onTabClick(lang: 'uk' | 'en') {
    this.tabChange.emit(lang);
  }

  hasErrors(lang: 'uk' | 'en'): boolean {
    const group = this.translationsGroup.get(lang) as FormGroup;
    return (group && group.invalid && (group.dirty || group.touched));
  }
}
