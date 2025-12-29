import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { DrillAdminService } from '../../../services/drill/drill-admin.service';
import { ToastService } from '../../../services/toast.service';
import { ConfirmationService } from '../../../services/confirmation.service';
import { DrillUiService } from '../../../services/drill/drill-ui.service';
import { DRILL_CATEGORIES, DRILL_LEVELS, DrillCategory, FirestoreDrill } from '../../../models/drill.model';

@Component({
  selector: 'app-drill-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, RouterLink],
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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly categories = DRILL_CATEGORIES;
  readonly levels = DRILL_LEVELS;

  rawDrills = signal<FirestoreDrill[]>([]);
  searchQuery = signal<string>('');
  selectedCategoryFilter = signal<DrillCategory | null>(null);

  interfaceLang = signal<'en' | 'uk'>('en');
  activeFormTab = signal<'en' | 'uk'>('en');

  selectedDrillId = signal<string | null>(null);
  selectedDrill = computed(() => {
    const id = this.selectedDrillId();
    return id ? this.rawDrills().find(d => d.id === id) || null : null;
  });

  isCreating = signal(true);
  isSaving = signal(false);

  filteredDrills = computed(() => {
    const list = this.rawDrills();
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

  drillForm: FormGroup;
  private drillsSub?: Subscription;

  constructor() {
    this.drillForm = this.fb.group({
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

  ngOnInit() {
    this.updateInterfaceLang(this.translate.currentLang);

    this.drillsSub = this.translate.onLangChange.subscribe(e => {
      this.updateInterfaceLang(e.lang);
    });

    const firestoreSub = this.drillAdmin.getDrillsStream().subscribe({
      next: (data) => this.rawDrills.set(data),
      error: (err) => {
        console.error(err);
        this.toast.error('Could not load drills');
      }
    });

    this.drillsSub.add(firestoreSub);

    const routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.selectedDrillId.set(id);
        this.isCreating.set(false);
        this.loadDrill(id);
      } else {
        this.selectedDrillId.set(null);
        this.isCreating.set(true);
        this.createNewDrill();
      }
    });
    this.drillsSub.add(routeSub);
  }

  private loadDrill(id: string) {
    this.drillAdmin.getDrillById(id).subscribe(data => {
      if (data) {
        this.populateForm(data);
      } else {
        this.toast.error('Drill not found');
        this.router.navigate(['/admin/drill/new']);
      }
    });
  }

  ngOnDestroy() {
    this.drillsSub?.unsubscribe();
  }

  private updateInterfaceLang(lang: string) {
    this.interfaceLang.set((lang === 'uk' ? 'uk' : 'en'));
  }

  getInstructions(lang: 'en' | 'uk'): FormArray {
    return this.drillForm.get(['translations', lang, 'instructions']) as FormArray;
  }

  getCoachingTips(lang: 'en' | 'uk'): FormArray {
    return this.drillForm.get(['translations', lang, 'coachingTips']) as FormArray;
  }

  getEquipment(lang: 'en' | 'uk'): FormArray {
    return this.drillForm.get(['translations', lang, 'equipment']) as FormArray;
  }

  addItem(array: FormArray, value = '') {
    array.push(this.fb.control(value, Validators.required));
  }

  removeItem(array: FormArray, index: number) {
    array.removeAt(index);
    this.drillForm.markAsDirty();
  }

  isControlInvalid(path: string | (string | number)[]) {
    const control = this.drillForm.get(path);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  hasTabErrors(lang: 'en' | 'uk'): boolean {
    const group = this.drillForm.get(['translations', lang]) as FormGroup;
    return (group && group.invalid);
  }

  selectDrill(drill: FirestoreDrill) {
    if (this.drillForm.dirty && !confirm('Discard unsaved changes?')) return;
    this.router.navigate(['/admin/drill/edit', drill.id]);
  }

  private populateForm(drill: FirestoreDrill) {
    (['en', 'uk'] as const).forEach(lang => {
      this.getInstructions(lang).clear();
      this.getCoachingTips(lang).clear();
      this.getEquipment(lang).clear();
    });

    (['en', 'uk'] as const).forEach(lang => {
      const trans = drill.translations[lang] || {};

      const instArr = this.getInstructions(lang);
      (trans.instructions || []).forEach((v: string) => this.addItem(instArr, v));

      const tipsArr = this.getCoachingTips(lang);
      (trans.coachingTips || []).forEach((v: string) => this.addItem(tipsArr, v));

      const equipArr = this.getEquipment(lang);
      (trans.equipment || []).forEach((v: string) => this.addItem(equipArr, v));
    });

    this.drillForm.patchValue({
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
    this.drillForm.markAsPristine();
  }

  createNewDrill() {
    if (this.isCreating() === false && this.drillForm.dirty && !confirm('Discard unsaved changes?')) return;

    // If we are already in "new" route but called manually
    if (!this.isCreating()) {
      this.router.navigate(['/admin/drill/new']);
      return;
    }

    this.selectedDrillId.set(null);
    this.activeFormTab.set(this.interfaceLang());

    (['en', 'uk'] as const).forEach(lang => {
      this.getInstructions(lang).clear();
      this.getCoachingTips(lang).clear();
      this.getEquipment(lang).clear();
    });

    this.drillForm.reset({
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

  async saveDrill() {
    this.drillForm.markAllAsTouched();

    if (this.drillForm.invalid) {
      this.toast.error(this.translate.instant('ADMIN_EDITOR.MESSAGES.VALIDATION_ERROR'));
      return;
    }

    this.isSaving.set(true);
    const formData = this.drillForm.getRawValue();
    const drillId = this.selectedDrillId();

    try {
      if (this.isCreating()) {
        const id = await this.drillAdmin.addDrill(formData);
        this.toast.success(this.translate.instant('ADMIN_EDITOR.MESSAGES.CREATE_SUCCESS'));
        this.router.navigate(['/admin/drill/edit', id], { replaceUrl: true });
      } else if (drillId) {
        await this.drillAdmin.updateDrill(drillId, formData);
        this.toast.success(this.translate.instant('ADMIN_EDITOR.MESSAGES.UPDATE_SUCCESS'));
      }
    } catch (error) {
      console.error(error);
      this.toast.error(this.translate.instant('ADMIN_EDITOR.MESSAGES.SAVE_ERROR'));
    } finally {
      this.isSaving.set(false);
    }
  }

  deleteDrill(event: Event, drill: FirestoreDrill) {
    event.stopPropagation();
    const lang = this.interfaceLang();
    const name = drill.translations[lang]?.name || drill.translations.en.name;

    this.confirm.confirm({
      title: this.translate.instant('ADMIN_EDITOR.BUTTONS.DELETE'),
      message: this.translate.instant('ADMIN_EDITOR.MESSAGES.DELETE_CAUTION', { name }),
      confirmText: this.translate.instant('ADMIN_EDITOR.BUTTONS.DELETE'),
      isDestructive: true
    }).subscribe(async (confirmed) => {
      if (confirmed) {
        try {
          await this.drillAdmin.deleteDrill(drill.id);
          this.toast.success(this.translate.instant('ADMIN_EDITOR.MESSAGES.DELETE_SUCCESS'));
          if (this.selectedDrillId() === drill.id) {
            this.cancelEdit();
          }
        } catch (error) {
          this.toast.error('Could not delete drill');
        }
      }
    });
  }

  cancelEdit() {
    this.router.navigate(['/admin/drill/new']);
  }

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
