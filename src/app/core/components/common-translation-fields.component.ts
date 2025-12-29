import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-common-translation-fields',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div [formGroup]="langGroup" class="space-y-6">
      <!-- Name -->
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          {{ 'EDITOR.COMMON.FIELDS.NAME' | translate }}
        </label>
        <input formControlName="name"
               [placeholder]="'EDITOR.COMMON.PLACEHOLDERS.NAME' | translate"
               class="modern-input h-14 md:h-16 text-lg md:text-2xl font-black placeholder:text-slate-200"
               [class.border-rose-500]="isInvalid('name')">
      </div>

      <!-- Description -->
      <div class="space-y-2">
        <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          {{ 'EDITOR.COMMON.FIELDS.DESCRIPTION' | translate }}
        </label>
        <textarea formControlName="description"
                  [placeholder]="'EDITOR.COMMON.PLACEHOLDERS.DESCRIPTION' | translate"
                  rows="4"
                  class="modern-input py-4 text-sm md:text-base font-medium resize-none"
                  [class.border-rose-500]="isInvalid('description')"></textarea>
      </div>
    </div>
  `,
  styleUrls: ['../styles/admin-editor.css']
})
export class CommonTranslationFieldsComponent {
  @Input({ required: true }) langGroup!: FormGroup;
  @Input({ required: true }) translationPrefix: string = 'EDITOR.COMMON';

  isInvalid(field: string): boolean {
    const control = this.langGroup.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
