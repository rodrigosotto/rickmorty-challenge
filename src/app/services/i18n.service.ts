import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SupportedLanguage = 'pt' | 'en' | 'es';

export interface Translations {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private currentLanguageSubject = new BehaviorSubject<SupportedLanguage>('pt');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: Record<SupportedLanguage, Translations> = {
    pt: {
      'app.title': 'Rick & Morty',
      'nav.home': 'INÍCIO',
      'nav.favorites': 'FAVORITOS',
      'search.placeholder': 'Pesquisar personagem...',
      'search.label': 'Pesquisar',
      'loading.text': 'Carregando personagens...',
      'loading.more': 'Carregando mais...',
      'end.message': 'Você chegou ao fim da lista! 🎉',
      'error.load': 'Erro ao carregar personagens. Tente novamente.',
      'error.search': 'Erro ao buscar personagens. Tente novamente.',
      'search.title': 'Resultados da Pesquisa',
      'search.empty': 'Nada foi encontrado',
      'search.emptySpan': 'Tente realizar uma nova busca.',
      'favorites.title': 'Favoritos',
      'favorites.empty': 'Nenhum personagem favoritado ainda.',
      'favorites.add': 'Adicionar aos favoritos',
      'favorites.remove': 'Remover dos favoritos',
      'character.status.unknown': 'Desconhecido',
      'favorites.clearAll': 'Remover tudo',
      'favorites.emptySpan':
        'Retorne à página inicial e escolha os melhores para você.',
      'favorites.emptyButton': 'Voltar ao início',
    },
    en: {
      'app.title': 'Rick & Morty',
      'nav.home': 'HOME',
      'nav.favorites': 'FAVORITES',
      'search.placeholder': 'Search character...',
      'search.label': 'Search',
      'loading.text': 'Loading characters...',
      'loading.more': 'Loading more...',
      'end.message': 'You reached the end of the list! 🎉',
      'error.load': 'Error loading characters. Please try again.',
      'error.search': 'Error searching characters. Please try again.',
      'search.title': 'Search Results',
      'search.empty': 'Nothing was found',
      'search.emptySpan': 'Try performing a new search.',
      'favorites.title': 'Favorites',
      'favorites.empty': 'No favorite characters yet.',
      'favorites.add': 'Add to favorites',
      'favorites.remove': 'Remove from favorites',
      'character.status.alive': 'Alive',
      'character.status.dead': 'Dead',
      'character.status.unknown': 'Unknown',
      'favorites.clearAll': 'Remove all',
      'favorites.emptySpan':
        'Return to the home page and choose the best for you.',
      'favorites.emptyButton': 'Go back to the home page',
    },
    es: {
      'app.title': 'Rick & Morty',
      'nav.home': 'INICIO',
      'nav.favorites': 'FAVORITOS',
      'search.placeholder': 'Buscar personaje...',
      'search.label': 'Buscar',
      'loading.text': 'Cargando personajes...',
      'loading.more': 'Cargando más...',
      'end.message': '¡Llegaste al final de la lista! 🎉',
      'error.load': 'Error al cargar personajes. Inténtalo de nuevo.',
      'error.search': 'Error al buscar personajes. Inténtalo de nuevo.',
      'search.title': 'Resultados de la búsqueda',
      'search.empty': 'No se encontró nada',
      'search.emptySpan': 'Intenta realizar una nueva búsqueda.',
      'favorites.title': 'Favoritos',
      'favorites.empty': 'Aún no hay personajes favoritos.',
      'favorites.add': 'Agregar a favoritos',
      'favorites.remove': 'Quitar de favoritos',
      'character.status.unknown': 'Desconocido',
      'favorites.clearAll': 'Remover todo',
      'favorites.emptySpan':
        'Retorne à página inicial e escolha os melhores para você.',
      'favorites.emptyButton': 'Volver al início',
    },
  };

  constructor() {
    // Carrega idioma salvo ou usa português como padrão
    const savedLang = localStorage.getItem(
      'preferred-language'
    ) as SupportedLanguage;
    if (savedLang && this.translations[savedLang]) {
      this.currentLanguageSubject.next(savedLang);
    }
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguageSubject.value;
  }

  setLanguage(language: SupportedLanguage): void {
    if (this.translations[language]) {
      this.currentLanguageSubject.next(language);
      localStorage.setItem('preferred-language', language);
    }
  }

  translate(key: string): string {
    const currentLang = this.getCurrentLanguage();
    return this.translations[currentLang][key] || key;
  }

  getSupportedLanguages(): SupportedLanguage[] {
    return Object.keys(this.translations) as SupportedLanguage[];
  }
}
