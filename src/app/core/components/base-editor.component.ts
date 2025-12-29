import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Subject, takeUntil} from 'rxjs';
import {ToastService} from '../../services/toast.service';
import {ConfirmationService} from '../../services/confirmation.service';
import {CrudService} from '../interfaces/crud-service.interface';

@Component({template: ''})
export abstract class BaseEditorComponent<T extends { id: string; translations?: any }> implements OnInit, OnDestroy {
  protected readonly fb = inject(FormBuilder);
  protected readonly toast = inject(ToastService);
  protected readonly confirmationService = inject(ConfirmationService);
  protected readonly translate = inject(TranslateService);
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);

  // --- Dependency Injection via Abstract Getters ---
  protected abstract get service(): CrudService<T>;

  protected abstract get translationKeyPrefix(): string; // e.g., 'PLAY_EDITOR' or 'ADMIN_EDITOR'
  protected abstract get listRoute(): string; // e.g., '/admin/plays' or '/admin/drill'

  // --- State Signals ---
  protected readonly destroy$ = new Subject<void>();

  public allItems = signal<T[]>([]);
  public selectedItemId = signal<string | null>(null);
  public isCreating = signal(true);
  public isSaving = signal(false);
  public isLoading = signal(false);

  public interfaceLang = signal<'en' | 'uk'>('en');
  public activeFormTab = signal<'en' | 'uk'>('en');

  public editorForm!: FormGroup;

  ngOnInit(): void {
    this.updateInterfaceLang(this.translate.currentLang);
    this.editorForm = this.initForm();

    // Listen to interface language changes
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(e => this.updateInterfaceLang(e.lang));

    // Listen to route params
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        this.handleRouteId(id);
      });

    // Load list for sidebar
    this.service.getAllList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => this.allItems.set(data),
        error: (err) => {
          console.error(err);
          this.toast.error('Could not load items');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected updateInterfaceLang(lang: string): void {
    const safeLang = lang === 'uk' ? 'uk' : 'en';
    this.interfaceLang.set(safeLang);
    // Sync active tab with interface lang on load or change if form is clean
    if (this.editorForm?.pristine) {
      this.activeFormTab.set(safeLang);
    }
  }

  protected handleRouteId(id: string | null): void {
    if (id) {
      this.selectedItemId.set(id);
      this.isCreating.set(false);
      this.loadItem(id);
    } else {
      this.selectedItemId.set(null);
      this.isCreating.set(true);
      this.resetToNew();
    }
  }

  private loadItem(id: string): void {
    this.isLoading.set(true);
    this.service.getById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.isLoading.set(false);
        if (data) {
          this.populateForm(data);
        } else {
          this.toast.error(this.translate.instant('EDITOR.COMMON.MESSAGES.NOT_FOUND'));
          this.router.navigate([this.listRoute, 'new']);
        }
      });
  }

  public async save(): Promise<void> {
    this.editorForm.markAllAsTouched();

    if (this.editorForm.invalid) {
      this.toast.error(this.translate.instant('EDITOR.COMMON.MESSAGES.VALIDATION_ERROR'));
      return;
    }

    this.isSaving.set(true);
    const formData = this.editorForm.getRawValue();
    const id = this.selectedItemId();

    try {
      if (this.isCreating()) {
        const newId = await this.service.add(formData);
        this.toast.success(this.translate.instant('EDITOR.COMMON.MESSAGES.CREATE_SUCCESS'));
        this.router.navigate([this.listRoute, 'edit', newId], {replaceUrl: true});
      } else if (id) {
        await this.service.update(id, formData);
        this.toast.success(this.translate.instant('EDITOR.COMMON.MESSAGES.UPDATE_SUCCESS'));
        this.editorForm.markAsPristine();
      }
    } catch (error) {
      console.error(error);
      this.toast.error(this.translate.instant('EDITOR.COMMON.MESSAGES.SAVE_ERROR'));
    } finally {
      this.isSaving.set(false);
    }
  }

  public delete(id: string, displayName: string): void {
    this.confirmationService.confirm({
      title: this.translate.instant('EDITOR.COMMON.BUTTONS.DELETE'),
      message: this.translate.instant('EDITOR.COMMON.MESSAGES.DELETE_CAUTION', {name: displayName}),
      confirmText: this.translate.instant('EDITOR.COMMON.BUTTONS.DELETE'),
      isDestructive: true
    }).subscribe(async (confirmed) => {
      if (confirmed) {
        try {
          await this.service.delete(id);
          this.toast.success(this.translate.instant('EDITOR.COMMON.MESSAGES.DELETE_SUCCESS'));
          if (this.selectedItemId() === id) {
            this.router.navigate([this.listRoute, 'new']);
          }
        } catch (error) {
          console.error(error);
          this.toast.error('Could not delete item');
        }
      }
    });
  }

  public cancel(): void {
    if (this.editorForm.dirty && !confirm('Discard unsaved changes?')) return;
    this.router.navigate([this.listRoute, 'new']);
  }

  public switchTab(lang: 'en' | 'uk'): void {
    this.activeFormTab.set(lang);
  }

  /** Component-specific form initialization */
  protected abstract initForm(): FormGroup;

  /** Component-specific form population */
  protected abstract populateForm(data: T): void;

  /** Component-specific form reset for new item */
  protected abstract resetToNew(): void;
}
