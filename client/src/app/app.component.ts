import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  navbarElevation = true;

  // Injecting here ensures ThemeService is created at app startup
  // so the dark-theme class is applied to <html> before first render
  constructor(readonly themeService: ThemeService) { }
}
