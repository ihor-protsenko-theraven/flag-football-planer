import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden h-full">
      <!-- Image Placeholder -->
      <div class="h-48 w-full bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
      
      <div class="p-5 flex flex-col gap-4">
        <!-- Title Placeholder -->
        <div class="h-7 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 animate-pulse"></div>
        
        <!-- Badges Placeholder -->
        <div class="flex flex-wrap gap-2">
          <div class="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
          <div class="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
          <div class="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
        </div>
        
        <!-- Footer/Duration Placeholder -->
        <div class="flex items-center justify-between pt-2 mt-auto">
          <div class="flex items-center gap-2">
            <div class="h-5 w-5 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse"></div>
            <div class="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SkeletonCardComponent { }
