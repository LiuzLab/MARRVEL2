import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'marrvel-theme';

  isDark = signal<boolean>(this.loadPreference());

  constructor() {
    this.applyClass(this.isDark());
    this.listenToSystemTheme();
  }

  toggle() {
    this.isDark.update(v => !v);
    localStorage.setItem(this.STORAGE_KEY, this.isDark() ? 'dark' : 'light');
    this.applyClass(this.isDark());
  }

  private applyClass(dark: boolean): void {
    document.documentElement.classList.toggle('dark-theme', dark);
  }

  private loadPreference(): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) return stored === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }

  private listenToSystemTheme(): void {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mediaQuery) return;

    mediaQuery.addEventListener('change', (event) => {
      // Only follow system changes if the user hasn't set a manual preference
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.isDark.set(event.matches);
        this.applyClass(event.matches);
      }
    });
  }
}
