import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ConfirmationModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Flag Training Planner';

  constructor(private translate: TranslateService) {
    // Set default language
    translate.setDefaultLang('uk');
    // Use default language
    translate.use('uk');
  }
}
