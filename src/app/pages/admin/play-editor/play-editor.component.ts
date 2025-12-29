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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { PlaysService } from '../../../services/plays/plays.service';
import { PlaysUiService } from '../../../services/plays/plays-ui.service';
import { ToastService } from '../../../services/toast.service';
import { ConfirmationService } from '../../../services/confirmation.service';
import {
  FirestorePlays,
  PlayCategory,
  PLAYS_CATEGORIES,
  PLAYS_COMPLEXITIES,
  PLAYS_PERSONNEL
} from '../../../models/plays.model';

@Component({
  selector: 'app-play-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, RouterLink],
  templateUrl: './play-editor.component.html',
  styleUrls: ['./play-editor.component.css']
})
export class PlayEditorComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private playsService = inject(PlaysService);
  private playsUi = inject(PlaysUiService);
  private toast = inject(ToastService);
  private confirm = inject(ConfirmationService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly categories = PLAYS_CATEGORIES;
  readonly complexities = PLAYS_COMPLEXITIES;
  readonly personnelOptions = PLAYS_PERSONNEL;

  interfaceLang = signal<'en' | 'uk'>('en');
  activeFormTab = signal<'en' | 'uk'>('en');

  rawPlays = signal<FirestorePlays[]>([]);
  searchQuery = signal<string>('');
  selectedCategoryFilter = signal<PlayCategory | null>(null);

  filteredPlays = computed(() => {
    const list = this.rawPlays();
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

  selectedPlayId = signal<string | null>(null);
  selectedPlay = computed(() => {
    const id = this.selectedPlayId();
    return id ? this.rawPlays().find(p => p.id === id) || null : null;
  });

  isCreating = signal(true);
  isSaving = signal(false);

  playForm: FormGroup;
  private sub?: Subscription;

  constructor() {
    this.playForm = this.fb.group({
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

  ngOnInit() {
    this.updateInterfaceLang(this.translate.currentLang);

    this.sub = this.translate.onLangChange.subscribe(e => {
      this.updateInterfaceLang(e.lang);
    });

    // Fetch sidebar list
    const playsSub = this.playsService.getRawCombinationsStream().subscribe(data => {
      this.rawPlays.set(data);
    });
    this.sub.add(playsSub);

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.selectedPlayId.set(id);
        this.isCreating.set(false);
        this.loadPlay(id);
      } else {
        this.selectedPlayId.set(null);
        this.isCreating.set(true);
        this.createNewPlay();
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private updateInterfaceLang(lang: string) {
    this.interfaceLang.set((lang === 'uk' ? 'uk' : 'en'));
  }

  selectPlay(play: FirestorePlays) {
    if (this.playForm.dirty && !confirm('Discard unsaved changes?')) return;
    this.router.navigate(['/admin/plays/edit', play.id]);
  }

  cancelEdit() {
    // For mobile back or generic cancel, go to "new" state which acts as the empty/default state
    this.router.navigate(['/admin/plays/new']);
  }

  private loadPlay(id: string) {
    this.playsService.getRawPlayById(id).subscribe(data => {
      if (data) {
        this.populateForm(data);
      } else {
        this.toast.error('Play not found');
        this.router.navigate(['/admin/plays/new']);
      }
    });
  }

  getKeyPoints(lang: 'en' | 'uk'): FormArray {
    return this.playForm.get(['translations', lang, 'keyPoints']) as FormArray;
  }

  addItem(array: FormArray, value = '') {
    array.push(this.fb.control(value, Validators.required));
  }

  removeItem(array: FormArray, index: number) {
    array.removeAt(index);
    this.playForm.markAsDirty();
  }

  isControlInvalid(path: string | (string | number)[]) {
    const control = this.playForm.get(path);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  hasTabErrors(lang: 'en' | 'uk'): boolean {
    const group = this.playForm.get(['translations', lang]) as FormGroup;
    return (group && group.invalid && group.dirty);
  }

  private populateForm(play: FirestorePlays) {
    (['en', 'uk'] as const).forEach(lang => {
      this.getKeyPoints(lang).clear();
    });

    (['en', 'uk'] as const).forEach(lang => {
      const trans = play.translations[lang] || {};
      const kpArr = this.getKeyPoints(lang);
      (trans.keyPoints || []).forEach((v: string) => this.addItem(kpArr, v));
    });

    this.playForm.patchValue({
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
  }

  createNewPlay() {
    if (this.playForm.dirty && !confirm('Discard unsaved changes?')) return;

    this.selectedPlayId.set(null);
    this.isCreating.set(true);
    this.activeFormTab.set(this.interfaceLang());

    (['en', 'uk'] as const).forEach(lang => {
      this.getKeyPoints(lang).clear();
    });

    this.playForm.reset({
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

  async savePlay() {
    this.playForm.markAllAsTouched();

    if (this.playForm.invalid) {
      this.toast.error(this.translate.instant('PLAY_EDITOR.MESSAGES.VALIDATION_ERROR'));
      return;
    }

    this.isSaving.set(true);
    const formData = this.playForm.getRawValue();
    const playId = this.selectedPlayId();

    try {
      if (this.isCreating()) {
        const id = await this.playsService.addPlay(formData);
        this.toast.success(this.translate.instant('PLAY_EDITOR.MESSAGES.CREATE_SUCCESS'));
        this.router.navigate(['/admin/plays/edit', id], { replaceUrl: true });
      } else if (playId) {
        await this.playsService.updatePlay(playId, formData);
        this.toast.success(this.translate.instant('PLAY_EDITOR.MESSAGES.UPDATE_SUCCESS'));
      }
    } catch (error) {
      console.error(error);
      this.toast.error(this.translate.instant('PLAY_EDITOR.MESSAGES.SAVE_ERROR'));
    } finally {
      this.isSaving.set(false);
    }
  }

  deletePlay() {
    const playId = this.selectedPlayId();
    if (!playId) return;

    this.confirm.confirm({
      title: this.translate.instant('PLAY_EDITOR.BUTTONS.DELETE'),
      message: this.translate.instant('PLAY_EDITOR.MESSAGES.DELETE_CAUTION', { name: '#' + playId }),
      confirmText: this.translate.instant('PLAY_EDITOR.BUTTONS.DELETE'),
      isDestructive: true
    }).subscribe(async (confirmed) => {
      if (confirmed) {
        try {
          await this.playsService.deletePlay(playId);
          this.toast.success(this.translate.instant('PLAY_EDITOR.MESSAGES.DELETE_SUCCESS'));
          this.router.navigate(['/admin/plays/new']);
        } catch (error) {
          this.toast.error('Could not delete play');
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/plays']);
  }

  getCategoryBaseStyle(category: string): string {
    return this.playsUi.getCategoryStyle(category as PlayCategory);
  }

  switchFormTab(lang: 'en' | 'uk') {
    this.activeFormTab.set(lang);
  }

  getTranslationControl(field: string): FormControl {
    return this.playForm.get(['translations', this.activeFormTab(), field]) as FormControl;
  }
}
