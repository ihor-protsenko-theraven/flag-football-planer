import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { routes } from './app.routes';
import { PDF_THEME_CONFIG, DEFAULT_PDF_THEME } from './core/config/pdf-theme.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'uk',
      loader: provideTranslateHttpLoader({
        prefix: 'assets/i18n/',
        suffix: '.json'
      })
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    { provide: PDF_THEME_CONFIG, useValue: DEFAULT_PDF_THEME }
  ]
};
