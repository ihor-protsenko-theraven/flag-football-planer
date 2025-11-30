import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Flag Training Planner';

  constructor(private translate: TranslateService) {
    // Set default language
    translate.setDefaultLang('en');
    // Use default language
    translate.use('en');
  }
}
