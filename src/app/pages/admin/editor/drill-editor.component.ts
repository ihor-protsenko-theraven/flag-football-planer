import {ChangeDetectorRef, Component, computed, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';

import {DrillAdminService} from '../../../services/drill-admin.service';
import {ToastService} from '../../../services/toast.service';
import {ConfirmationService} from '../../../services/confirmation.service';
import {DrillUiService} from '../../../services/drill-ui.service';
import {DRILL_CATEGORIES, DRILL_LEVELS, DrillCategory, FirestoreDrill} from '../../../models/drill.model';

@Component({
  selector: 'app-drill-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './drill-editor.component.html',
  styleUrls: ['./drill-editor.component.css']
})
export class DrillEditorComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private drillAdmin = inject(DrillAdminService);
  private drillUi = inject(DrillUiService);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmationService);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef)

  readonly categories = DRILL_CATEGORIES;
  readonly levels = DRILL_LEVELS;

  // --- Data Signals ---
  rawDrills = signal<FirestoreDrill[]>([]);
  searchQuery = signal<string>('');
  selectedCategoryFilter = signal<DrillCategory | null>(null);

  // --- Language Architecture ---
  // 1. Interface Language (Global - sync with TranslateService)
  interfaceLang = signal<'en' | 'uk'>('en');

  // 2. Data Tab Language (Local - just controls which form group is visible)
  activeFormTab = signal<'en' | 'uk'>('en');

  // Selection State
  selectedDrillId = signal<string | null>(null);
  selectedDrill = computed(() => {
    const id = this.selectedDrillId();
    if (!id) return null;
    return this.rawDrills().find(d => d.id === id) || null;
  });

  isCreating = signal(false);
  isSaving = signal(false);

  // Derived Filtered List
  filteredDrills = computed(() => {
    const list = this.rawDrills();
    const query = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategoryFilter();
    // Sidebar list MUST react to the global app language
    const currentLang = this.interfaceLang();

    return list.filter(drill => {
      // Find name in global language, fallback to English
      const name = drill.translations[currentLang]?.name || drill.translations.en?.name || '';

      const matchSearch = !query || name.toLowerCase().includes(query);
      const matchCat = !cat || drill.category === cat;

      return matchSearch && matchCat;
    }).sort((a, b) => {
      const nameA = a.translations[currentLang]?.name || a.translations.en?.name || '';
      const nameB = b.translations[currentLang]?.name || b.translations.en?.name || '';
      return nameA.localeCompare(nameB);
    });
  });

  // Типізована форма
  drillForm: FormGroup;
  private drillsSub?: Subscription;

  constructor() {
    this.drillForm = this.fb.group({
      duration: [10, [Validators.required, Validators.min(1)]],
      category: ['passing', Validators.required],
      level: ['beginner', Validators.required],
      imageUrl: [''],
      equipment: this.fb.array([]),
      translations: this.fb.group({
        en: this.fb.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          instructions: this.fb.array([]),
          coachingTips: this.fb.array([])
        }),
        uk: this.fb.group({
          name: [''], // Ukrainian name is optional
          description: [''], // Ukrainian description is optional
          instructions: this.fb.array([]),
          coachingTips: this.fb.array([])
        })
      })
    });

    // Reactive Language Synchronization (Optional - removed synchronization as per user request to decouple)
    // effect(() => {
    //   const lang = this.activeFormTab();
    //   this.translate.use(lang);
    // });

    // Optional: Auto-sync form when backend data changes (Advanced)
    // effect(() => {
    //   const drill = this.selectedDrill();
    //   if (drill && !this.drillForm.dirty) {
    //      this.populateForm(drill);
    //   }
    // });
  }

  ngOnInit() {
    // Initial Sync
    this.updateInterfaceLang(this.translate.currentLang);

    // Listen to global language changes (Navbar switch)
    this.drillsSub = this.translate.onLangChange.subscribe(e => {
      this.updateInterfaceLang(e.lang);
    });

    const firestoreSub = this.drillAdmin.getDrillsStream().subscribe({
      next: (data) => this.rawDrills.set(data),
      error: (err) => {
        console.error('Error fetching drills:', err);
        this.toast.error('Could not load drills library');
      }
    });

    this.drillsSub.add(firestoreSub);
  }

  private updateInterfaceLang(lang: string) {
    this.interfaceLang.set((lang === 'uk' ? 'uk' : 'en'));
  }

  ngOnDestroy() {
    this.drillsSub?.unsubscribe();
  }

  // Helper для отримання поточної мови інтерфейсу (для списку зліва)
  activeInterfaceLang(): 'en' | 'uk' {
    const current = this.translate.currentLang;
    return (current === 'uk' ? 'uk' : 'en');
  }

  // --- Form Array Getters ---
  get equipment() {
    return this.drillForm.get('equipment') as FormArray;
  }

  // Отримуємо масив інструкцій динамічно, залежно від переданої мови
  getInstructions(lang: 'en' | 'uk') {
    return this.drillForm.get(['translations', lang, 'instructions']) as FormArray;
  }

  getCoachingTips(lang: 'en' | 'uk') {
    return this.drillForm.get(['translations', lang, 'coachingTips']) as FormArray;
  }

  addItem(array: FormArray, value = '') {
    array.push(this.fb.control(value));
  }

  removeItem(array: FormArray, index: number) {
    array.removeAt(index);
  }

  // --- Validation Helpers ---
  isControlInvalid(path: string | (string | number)[]) {
    const control = this.drillForm.get(path);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  hasTabErrors(lang: 'en' | 'uk'): boolean {
    const group = this.drillForm.get(['translations', lang]) as FormGroup;
    return !!(group && group.invalid);
  }

  private findInvalidControls() {
    const invalid: string[] = [];
    const controls = this.drillForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    // Deep check for translations
    const en = this.drillForm.get(['translations', 'en']);
    const uk = this.drillForm.get(['translations', 'uk']);
    if (en?.invalid) invalid.push('English Content');
    if (uk?.invalid) invalid.push('Ukrainian Content');
    return invalid;
  }

  // --- Actions ---
  selectDrill(drill: FirestoreDrill) {
    this.isCreating.set(false);
    this.selectedDrillId.set(drill.id);

    // When selecting, the form tab stays what it was, or we can default it.
    // Crucially: We fill BOTH language groups in the form immediately.
    this.populateForm(drill);
  }

  private populateForm(drill: FirestoreDrill) {
    // 1. Очищаємо всі масиви
    this.equipment.clear();
    (['en', 'uk'] as const).forEach(lang => {
      this.getInstructions(lang).clear();
      this.getCoachingTips(lang).clear();
    });

    // 2. Заповнюємо обладнання
    (drill.equipment || []).forEach(val => this.addItem(this.equipment, val));

    // 3. Заповнюємо переклади для ОБОХ мов
    (['en', 'uk'] as const).forEach(lang => {
      const trans = drill.translations[lang] || {};
      const instArr = this.getInstructions(lang);
      const tipsArr = this.getCoachingTips(lang);

      (trans.instructions || []).forEach((v: string) => this.addItem(instArr, v));
      (trans.coachingTips || []).forEach((v: string) => this.addItem(tipsArr, v));
    });

    // 4. Заповнюємо прості поля
    this.drillForm.patchValue({
      duration: drill.duration,
      category: drill.category,
      level: drill.level,
      imageUrl: drill.imageUrl || '',
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
  }

  createNewDrill() {
    this.selectedDrillId.set(null);
    this.isCreating.set(true);
    // When creating, we can default the form tab to the interface language
    this.activeFormTab.set(this.interfaceLang());

    this.drillForm.reset({
      duration: 10,
      category: 'passing',
      level: 'beginner',
      imageUrl: '',
      translations: {
        en: {name: '', description: ''},
        uk: {name: '', description: ''}
      }
    });

    // Очищаємо масиви
    this.equipment.clear();
    (['en', 'uk'] as const).forEach(l => {
      this.getInstructions(l).clear();
      this.getCoachingTips(l).clear();
    });
  }

  async saveDrill() {
    this.drillForm.markAllAsTouched();

    if (this.drillForm.invalid) {
      const invalidFields = this.findInvalidControls();
      console.warn('Form Invalid. Fields:', invalidFields);

      // Detail the error message
      let errorMsg = this.translate.instant('ADMIN_EDITOR.MESSAGES.VALIDATION_ERROR');
      if (invalidFields.includes('English Content')) {
        errorMsg += ` (${this.translate.instant('ADMIN_EDITOR.TABS.ENGLISH')})`;
      }

      this.toast.error(errorMsg);
      return;
    }

    this.isSaving.set(true);
    const formData = this.drillForm.getRawValue() as Omit<FirestoreDrill, 'id'>;
    const drillId = this.selectedDrill()?.id;

    try {
      if (this.isCreating()) {
        await this.drillAdmin.addDrill(formData);
        this.toast.success(this.translate.instant('ADMIN_EDITOR.MESSAGES.CREATE_SUCCESS'));
      } else if (drillId) {
        await this.drillAdmin.updateDrill(drillId, formData as Partial<FirestoreDrill>);
        this.toast.success(this.translate.instant('ADMIN_EDITOR.MESSAGES.UPDATE_SUCCESS'));
      }
      this.cancelEdit();
    } catch (error) {
      console.error('Save Error:', error);
      this.toast.error(this.translate.instant('ADMIN_EDITOR.MESSAGES.SAVE_ERROR'));
    } finally {
      this.isSaving.set(false);
    }
  }

  deleteDrill(event: Event, drill: FirestoreDrill) {
    event.stopPropagation();
    // Use Interface language for alerts
    const lang = this.interfaceLang();
    const name = drill.translations[lang]?.name || drill.translations.en.name;

    this.confirm.confirm({
      title: this.translate.instant('ADMIN_EDITOR.BUTTONS.DELETE'),
      message: this.translate.instant('ADMIN_EDITOR.MESSAGES.DELETE_CAUTION', {name}),
      confirmText: this.translate.instant('ADMIN_EDITOR.BUTTONS.DELETE'),
      isDestructive: true
    }).subscribe(async (confirmed) => {
      if (confirmed) {
        try {
          await this.drillAdmin.deleteDrill(drill.id);
          this.toast.success(this.translate.instant('ADMIN_EDITOR.MESSAGES.DELETE_SUCCESS'));
          if (this.selectedDrill()?.id === drill.id) {
            this.cancelEdit();
          }
        } catch (error) {
          this.toast.error('Could not delete drill');
        }
      }
    });
  }

  cancelEdit() {
    this.selectedDrillId.set(null);
    this.isCreating.set(false);
    this.drillForm.reset();
  }

  // --- UI Helpers ---
  getCategoryBaseStyle(category: string): string {
    return this.drillUi.getCategoryStyle(category as DrillCategory);
  }

  switchFormTab(lang: 'en' | 'uk') {
    this.activeFormTab.set(lang);
  }

  getTranslationControl(field: string): FormControl {
    return this.drillForm.get(['translations', this.activeFormTab(), field]) as FormControl;
  }
}
