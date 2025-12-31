import {inject, Injectable} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {PlayCategory, PlayComplexity} from '../../models/plays.model';

@Injectable({
  providedIn: 'root'
})
export class PlaysUiService {

  private readonly sanitizer = inject(DomSanitizer);

  getCategoryStyle(category: PlayCategory | null): string {
    switch (category) {
      case 'pass_play':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'run_play':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'trick_play':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'defense_scheme':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  }

  getComplexityStyle(complexity: PlayComplexity | null): string {
    switch (complexity) {
      case 'basic':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'pro':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  }

  getCategoryIconClass(category: PlayCategory | string): string {
    switch (category) {
      case 'pass_play':
        return 'text-blue-600';
      case 'run_play':
        return 'text-emerald-600';
      case 'trick_play':
        return 'text-purple-600';
      case 'defense_scheme':
        return 'text-red-600';
      default:
        return 'text-slate-600';
    }
  }

  getCategoryIcon(category: PlayCategory | null): SafeHtml {
    let path = '';
    switch (category) {
      case 'pass_play':
        path = 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8';
        break;
      case 'run_play':
        path = 'M13 10V3L4 14h7v7l9-11h-7z';
        break;
      case 'trick_play':
        path = 'M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z';
        break; // Potion/Magic icon approximation
      case 'defense_scheme':
        path = 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
        break;
      default:
        path = 'M4 6h16M4 12h16m-7 6h7';
    }
    return this.sanitizer.bypassSecurityTrustHtml(`<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${path}" /></svg>`);
  }
}
