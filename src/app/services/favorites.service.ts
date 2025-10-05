import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Character {
  id: number;
  name: string;
  image: string;
  species: string;
  status: string;
  gender: string;
  origin: { name: string };
  location: { name: string };
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly STORAGE_KEY = 'rickandmorty_favorites';
  private readonly CHANNEL_NAME = 'favorites_channel';

  // BehaviorSubject para gerenciar o estado dos favoritos
  private favoritesSubject = new BehaviorSubject<Character[]>(
    this.loadFromStorage()
  );

  // Observable público para components se inscreverem
  public favorites$: Observable<Character[]> =
    this.favoritesSubject.asObservable();

  // BroadcastChannel para sincronização entre abas
  private channel: BroadcastChannel;

  constructor() {
    // Inicializa BroadcastChannel
    this.channel = new BroadcastChannel(this.CHANNEL_NAME);

    // Escuta mensagens de outras abas
    this.channel.onmessage = (event) => {
      if (event.data.type === 'FAVORITES_UPDATED') {
        console.log('Favoritos atualizados em outra aba, sincronizando...');
        const updatedFavorites = this.loadFromStorage();
        this.favoritesSubject.next(updatedFavorites);
      }
    };

    // Fallback: escuta eventos do localStorage (para navegadores sem BroadcastChannel)
    window.addEventListener('storage', (event) => {
      if (event.key === this.STORAGE_KEY) {
        console.log('LocalStorage alterado em outra aba, sincronizando...');
        const updatedFavorites = this.loadFromStorage();
        this.favoritesSubject.next(updatedFavorites);
      }
    });
  }

  /**
   * Retorna o Observable de favoritos
   */
  getFavorites(): Observable<Character[]> {
    return this.favorites$;
  }

  /**
   * Retorna o valor atual dos favoritos (snapshot)
   */
  getCurrentFavorites(): Character[] {
    return this.favoritesSubject.getValue();
  }

  /**
   * Adiciona um personagem aos favoritos
   */
  addFavorite(character: Character): void {
    const currentFavorites = this.getCurrentFavorites();

    // Verifica se já não está nos favoritos
    if (!this.isFavorite(character.id)) {
      const updatedFavorites = [...currentFavorites, character];
      this.updateFavorites(updatedFavorites);
    }
  }

  /**
   * Remove um personagem dos favoritos
   */
  removeFavorite(characterId: number): void {
    const currentFavorites = this.getCurrentFavorites();
    const updatedFavorites = currentFavorites.filter(
      (char) => char.id !== characterId
    );
    this.updateFavorites(updatedFavorites);
  }

  /**
   * Alterna o status de favorito de um personagem
   */
  toggleFavorite(character: Character): void {
    if (this.isFavorite(character.id)) {
      this.removeFavorite(character.id);
    } else {
      this.addFavorite(character);
    }
  }

  /**
   * Verifica se um personagem está nos favoritos
   */
  isFavorite(characterId: number): boolean {
    const currentFavorites = this.getCurrentFavorites();
    return currentFavorites.some((char) => char.id === characterId);
  }

  /**
   * Retorna a quantidade de favoritos
   */
  getFavoritesCount(): number {
    return this.getCurrentFavorites().length;
  }

  /**
   * Limpa todos os favoritos
   */
  clearAllFavorites(): void {
    this.updateFavorites([]);
  }

  /**
   * Destrói o canal de comunicação (cleanup)
   */
  destroy(): void {
    this.channel.close();
  }

  /**
   * Atualiza o BehaviorSubject e salva no storage
   */
  private updateFavorites(favorites: Character[]): void {
    this.favoritesSubject.next(favorites);
    this.saveToStorage(favorites);

    // Notifica outras abas sobre a mudança
    this.channel.postMessage({
      type: 'FAVORITES_UPDATED',
      timestamp: Date.now(),
    });
  }

  /**
   * Carrega favoritos do localStorage
   */
  private loadFromStorage(): Character[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar favoritos do storage:', error);
      return [];
    }
  }

  /**
   * Salva favoritos no localStorage
   */
  private saveToStorage(favorites: Character[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos no storage:', error);
    }
  }
}
