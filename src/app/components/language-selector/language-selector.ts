import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService, SupportedLanguage } from '../../services/i18n.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-selector.html',
  styleUrl: './language-selector.scss',
})
export class LanguageSelector {
  currentLanguage: SupportedLanguage;

  constructor(private i18nService: I18nService) {
    this.currentLanguage = this.i18nService.getCurrentLanguage();
  }

  onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const language = target.value as SupportedLanguage;
    this.i18nService.setLanguage(language);
    this.currentLanguage = language;
  }
}
