import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

import { DrillAdminService } from '../../../services/drill/drill-admin.service';
import { DrillUiService } from '../../../services/drill/drill-ui.service';
import { DRILL_CATEGORIES, DRILL_LEVELS, DrillCategory, FirestoreDrill } from '../../../models/drill.model';
import { BaseEditorComponent } from '../../../core/components/base-editor.component';
import { APP_ROUTES } from '../../../core/constants/routes';
import { TranslationTabsComponent } from '../../../core/components/translation-tabs/translation-tabs.component';
import { CommonTranslationFieldsComponent } from '../../../core/components/common-translation-fields.component';

@Component({
  selector: 'app-drill-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    TranslationTabsComponent,
    CommonTranslationFieldsComponent
  ],
  templateUrl: './drill-editor.component.html',
  styleUrls: [
    './drill-editor.component.css',
    '../../../core/styles/admin-editor.css'
  ]
})
export class DrillEditorComponent extends BaseEditorComponent<FirestoreDrill> {
  private readonly drillAdmin = inject(DrillAdminService);
  private readonly drillUi = inject(DrillUiService);

  readonly categories = DRILL_CATEGORIES;
  readonly levels = DRILL_LEVELS;

  protected override get service() { return this.drillAdmin; }
  protected override get translationKeyPrefix() { return 'EDITOR.DRILL'; }
  protected override get listRoute() { return APP_ROUTES.ADMIN.DRILLS; }

  searchQuery = signal<string>('');
  selectedCategoryFilter = signal<DrillCategory | null>(null);
  mobileSidebarVisible = signal(false);

  areFiltersActive = computed(() => {
    return this.searchQuery().trim() !== '' || this.selectedCategoryFilter() !== null;
  });

  filteredDrills = computed(() => {
    const list = this.allItems();
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategoryFilter();
    const lang = this.interfaceLang();

    return list.filter(drill => {
      const name = drill.translations[lang]?.name || drill.translations.en?.name || '';
      const matchSearch = !query || name.toLowerCase().includes(query);
      const matchCat = !cat || drill.category === cat;
      return matchSearch && matchCat;
    }).sort((a, b) => {
      const nameA = a.translations[lang]?.name || a.translations.en?.name || '';
      const nameB = b.translations[lang]?.name || b.translations.en?.name || '';
      return nameA.localeCompare(nameB);
    });
  });

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCategoryFilter.set(null);
  }

  protected initForm() {
    return this.fb.group({
      duration: [10, [Validators.required, Validators.min(1)]],
      category: ['passing', Validators.required],
      level: ['beginner', Validators.required],
      imageUrl: [''],
      videoUrl: [''],
      translations: this.fb.group({
        en: this.fb.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          instructions: this.fb.array([]),
          coachingTips: this.fb.array([]),
          equipment: this.fb.array([])
        }),
        uk: this.fb.group({
          name: [''],
          description: [''],
          instructions: this.fb.array([]),
          coachingTips: this.fb.array([]),
          equipment: this.fb.array([])
        })
      })
    });
  }

  protected populateForm(drill: FirestoreDrill) {
    (['en', 'uk'] as const).forEach(lang => {
      this.getInstructions(lang).clear();
      this.getCoachingTips(lang).clear();
      this.getEquipment(lang).clear();

      const trans = drill.translations[lang] || {};
      (trans.instructions || []).forEach((v: string) => this.addItem(this.getInstructions(lang), v));
      (trans.coachingTips || []).forEach((v: string) => this.addItem(this.getCoachingTips(lang), v));
      (trans.equipment || []).forEach((v: string) => this.addItem(this.getEquipment(lang), v));
    });

    this.editorForm.patchValue({
      duration: drill.duration,
      category: drill.category,
      level: drill.level,
      imageUrl: drill.imageUrl || '',
      videoUrl: drill.videoUrl || '',
      translations: {
        en: {
          name: drill.translations.en?.name || '',
          description: drill.translations.en?.description || ''
        },
        uk: {
          name: drill.translations.uk?.name || '',
          description: drill.translations.uk?.description || ''
        }
      }
    });

    this.activeFormTab.set(this.interfaceLang());
    this.editorForm.markAsPristine();
  }

  protected resetToNew() {
    this.activeFormTab.set(this.interfaceLang());
    (['en', 'uk'] as const).forEach(lang => {
      this.getInstructions(lang).clear();
      this.getCoachingTips(lang).clear();
      this.getEquipment(lang).clear();
    });

    this.editorForm.reset({
      duration: 15,
      category: 'passing',
      level: 'beginner',
      imageUrl: '',
      videoUrl: '',
      translations: {
        en: { name: '', description: '' },
        uk: { name: '', description: '' }
      }
    });
  }

  getInstructions(lang: string): FormArray {
    return this.editorForm.get(['translations', lang, 'instructions']) as FormArray;
  }

  getCoachingTips(lang: string): FormArray {
    return this.editorForm.get(['translations', lang, 'coachingTips']) as FormArray;
  }

  getEquipment(lang: string): FormArray {
    return this.editorForm.get(['translations', lang, 'equipment']) as FormArray;
  }

  addItem(array: FormArray, value = '') {
    array.push(this.fb.control(value, Validators.required));
  }

  removeItem(array: FormArray, index: number) {
    array.removeAt(index);
    this.editorForm.markAsDirty();
  }

  isControlInvalid(path: string | (string | number)[]) {
    const control = this.editorForm.get(path);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getCategoryBaseStyle(category: string): string {
    return this.drillUi.getCategoryStyle(category as DrillCategory);
  }

  get translationsGroup() {
    return this.editorForm.get('translations') as FormGroup;
  }

  getLangGroup(lang: string) {
    return this.translationsGroup.get(lang) as FormGroup;
  }

  toggleMobileSidebar() {
    this.mobileSidebarVisible.update(v => !v);
  }

  protected override handleRouteId(id: string | null) {
    super.handleRouteId(id);
    this.mobileSidebarVisible.set(false);
  }

  public override cancel() {
    super.cancel();
    this.mobileSidebarVisible.set(false);
  }
}
