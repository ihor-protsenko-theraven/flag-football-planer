import {Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Auth, signInWithEmailAndPassword} from '@angular/fire/auth';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-4xl font-display font-black text-slate-900 dark:text-white tracking-tight">
          {{ 'ADMIN_LOGIN.TITLE' | translate }}
        </h2>
        <p class="mt-2 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          {{ 'ADMIN_LOGIN.SUBTITLE' | translate }}
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          class="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 sm:rounded-[2.5rem] sm:px-10 border border-slate-100 dark:border-slate-800">
          <form class="space-y-6" (submit)="onSubmit($event)">
            <div>
              <label for="email" class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">
                {{ 'ADMIN_LOGIN.EMAIL' | translate }}
              </label>
              <input id="email" name="email" type="email" [(ngModel)]="email" required
                     class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600">
            </div>

            <div>
              <label for="password" class="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">
                {{ 'ADMIN_LOGIN.PASSWORD' | translate }}
              </label>
              <input id="password" name="password" type="password" [(ngModel)]="password" required
                     class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white font-medium focus:ring-4 focus:ring-green-500/10 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600">
            </div>

            <div>
              <button type="submit" [disabled]="isLoading()"
                      class="w-full flex justify-center items-center gap-3 bg-slate-900 dark:bg-green-600 hover:bg-slate-800 dark:hover:bg-green-500 text-white font-black py-5 px-10 rounded-2xl shadow-xl shadow-slate-900/10 active:scale-95 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                @if (isLoading()) {
                  <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ 'ADMIN_LOGIN.AUTHENTICATING' | translate }}
                } @else {
                  {{ 'ADMIN_LOGIN.SIGN_IN' | translate }}
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
  private auth = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private translate = inject(TranslateService);

  email = '';
  password = '';
  isLoading = signal(false);

  async onSubmit(event: Event) {
    event.preventDefault();
    if (!this.email || !this.password) return;

    this.isLoading.set(true);
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);

      this.toast.success(this.translate.instant('ADMIN_LOGIN.SUCCESS'));

      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/editor';
      this.router.navigateByUrl(returnUrl);
    } catch (error: any) {
      console.error('Login Error:', error);

      this.toast.error(this.translate.instant('ADMIN_LOGIN.ERROR'));
    } finally {
      this.isLoading.set(false);
    }
  }
}
