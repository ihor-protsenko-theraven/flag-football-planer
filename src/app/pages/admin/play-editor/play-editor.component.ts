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

import { PlaysService } from '../../../services/plays/plays.service';
import { PlaysUiService } from '../../../services/plays/plays-ui.service';
import {
  FirestorePlays,
  PlayCategory,
  PLAYS_CATEGORIES,
  PLAYS_COMPLEXITIES,
  PLAYS_PERSONNEL
} from '../../../models/plays.model';
import { BaseEditorComponent } from '../../../core/components/base-editor.component';
import { TranslationTabsComponent } from '../../../core/components/translation-tabs/translation-tabs.component';
import { CommonTranslationFieldsComponent } from '../../../core/components/common-translation-fields.component';

@Component({
  selector: 'app-play-editor',
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
  templateUrl: './play-editor.component.html',
  styleUrls: [
    './play-editor.component.css',
    '../../../core/styles/admin-editor.css'
  ]
})
export class PlayEditorComponent extends BaseEditorComponent<FirestorePlays> {
  private readonly playsService = inject(PlaysService);
  private readonly playsUi = inject(PlaysUiService);

  readonly categories = PLAYS_CATEGORIES;
  readonly complexities = PLAYS_COMPLEXITIES;
  readonly personnelOptions = PLAYS_PERSONNEL;

  protected override get service() { return this.playsService; }
  protected override get translationKeyPrefix() { return 'EDITOR.PLAY'; }
  protected override get listRoute() { return '/admin/plays'; }

  searchQuery = signal<string>('');
  selectedCategoryFilter = signal<PlayCategory | null>(null);
  mobileSidebarVisible = signal(false);

  areFiltersActive = computed(() => {
    return this.searchQuery().trim() !== '' || this.selectedCategoryFilter() !== null;
  });

  filteredPlays = computed(() => {
    const list = this.allItems();
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategoryFilter();
    const lang = this.interfaceLang();

    return list.filter(play => {
      const name = play.translations[lang]?.name || play.translations['en']?.name || '';
      const matchSearch = !query || name.toLowerCase().includes(query);
      const matchCat = !cat || play.category === cat;
      return matchSearch && matchCat;
    }).sort((a, b) => {
      const nameA = a.translations[lang]?.name || a.translations['en']?.name || '';
      const nameB = b.translations[lang]?.name || b.translations['en']?.name || '';
      return nameA.localeCompare(nameB);
    });
  });

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCategoryFilter.set(null);
  }

  protected initForm() {
    return this.fb.group({
      category: ['pass_play', Validators.required],
      complexity: ['basic', Validators.required],
      personnel: ['', Validators.required],
      formation: ['', Validators.required],
      imageUrl: [''],
      videoUrl: [''],
      translations: this.fb.group({
        en: this.fb.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          keyPoints: this.fb.array([])
        }),
        uk: this.fb.group({
          name: [''],
          description: [''],
          keyPoints: this.fb.array([])
        })
      })
    });
  }

  protected populateForm(play: FirestorePlays) {
    (['en', 'uk'] as const).forEach(lang => {
      this.getKeyPoints(lang).clear();
      const trans = play.translations[lang] || {};
      (trans.keyPoints || []).forEach((v: string) => this.addItem(this.getKeyPoints(lang), v));
    });

    this.editorForm.patchValue({
      category: play.category,
      complexity: play.complexity,
      personnel: play.personnel,
      formation: play.formation,
      imageUrl: play.imageUrl || '',
      videoUrl: play.videoUrl || '',
      translations: {
        en: {
          name: play.translations['en']?.name || '',
          description: play.translations['en']?.description || ''
        },
        uk: {
          name: play.translations['uk']?.name || '',
          description: play.translations['uk']?.description || ''
        }
      }
    });

    this.activeFormTab.set(this.interfaceLang());
    this.editorForm.markAsPristine();
  }

  protected resetToNew() {
    this.activeFormTab.set(this.interfaceLang());
    (['en', 'uk'] as const).forEach(lang => this.getKeyPoints(lang).clear());

    this.editorForm.reset({
      category: 'pass_play',
      complexity: 'basic',
      personnel: '',
      formation: '',
      imageUrl: '',
      videoUrl: '',
      translations: {
        en: { name: '', description: '' },
        uk: { name: '', description: '' }
      }
    });
  }

  getKeyPoints(lang: string): FormArray {
    return this.editorForm.get(['translations', lang, 'keyPoints']) as FormArray;
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
    return this.playsUi.getCategoryStyle(category as PlayCategory);
  }

  // Helper for template access to translation group
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
