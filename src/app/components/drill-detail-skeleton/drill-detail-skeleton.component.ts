import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-drill-detail-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="animate-pulse">
      <!-- Header Section Skeleton -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row md:items-center justify-between gap-6 mb-10">
          <div class="space-y-4">
            <div class="w-48 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div class="w-96 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          </div>
        </div>
      </div>

      <!-- Main Content Skeleton -->
      <div class="max-w-7xl mx-auto md:px-6 lg:px-8 overflow-hidden">
        <div class="bg-white dark:bg-slate-900 md:rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div class="grid lg:grid-cols-2 gap-0">
            
            <!-- Left: Hero Image Skeleton -->
            <div class="relative aspect-square md:aspect-video lg:aspect-auto lg:h-[600px] md:p-4 lg:p-6 bg-slate-50/50 dark:bg-slate-900/50">
              <div class="w-full h-full bg-slate-200 dark:bg-slate-800 md:rounded-[2.5rem]"></div>
            </div>

            <!-- Right: Info Section Skeleton -->
            <div class="p-8 md:p-12 lg:p-16 flex flex-col space-y-8">
              <div class="flex items-center gap-3">
                <div class="w-24 h-6 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                <div class="w-24 h-6 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
              </div>

              <div class="w-full h-16 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="h-32 bg-slate-100 dark:bg-slate-800 rounded-[2rem]"></div>
                <div class="h-32 bg-slate-100 dark:bg-slate-800 rounded-[2rem]"></div>
              </div>

              <div class="space-y-4">
                <div class="w-32 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                <div class="w-full h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl"></div>
              </div>

              <div class="mt-auto pt-10">
                <div class="w-full h-16 bg-slate-200 dark:bg-slate-800 rounded-[2rem]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary Content Skeleton -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid lg:grid-cols-3 gap-12">
          
          <!-- Instructions Skeleton -->
          <div class="lg:col-span-2 space-y-8">
            <div class="w-64 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl mb-8"></div>
            <div class="space-y-6">
              <div class="h-32 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800"></div>
              <div class="h-32 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800"></div>
              <div class="h-32 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800"></div>
            </div>
          </div>

          <!-- Sidebar Tips Skeleton -->
          <div class="h-[500px] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]"></div>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class DrillDetailSkeletonComponent { }
