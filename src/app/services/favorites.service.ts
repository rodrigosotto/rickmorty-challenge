import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Character } from '../interfaces/character';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly STORAGE_KEY = 'rickandmorty_favorites';
  private readonly CHANNEL_NAME = 'favorites_channel';

  private favoritesSubject = new BehaviorSubject<Character[]>(
    this.loadFromStorage()
  );

  public favorites$: Observable<Character[]> =
    this.favoritesSubject.asObservable();

  private channel: BroadcastChannel;

  constructor() {
    this.channel = new BroadcastChannel(this.CHANNEL_NAME);

    this.channel.onmessage = (event) => {
      if (event.data.type === 'FAVORITES_UPDATED') {
        const updatedFavorites = this.loadFromStorage();
        this.favoritesSubject.next(updatedFavorites);
      }
    };

    window.addEventListener('storage', (event) => {
      if (event.key === this.STORAGE_KEY) {
        const updatedFavorites = this.loadFromStorage();
        this.favoritesSubject.next(updatedFavorites);
      }
    });
  }

  getFavorites(): Observable<Character[]> {
    return this.favorites$;
  }

  getCurrentFavorites(): Character[] {
    return this.favoritesSubject.getValue();
  }

  addFavorite(character: Character) {
    const currentFavorites = this.getCurrentFavorites();

    if (!this.isFavorite(character.id)) {
      const updatedFavorites = [...currentFavorites, character];
      this.updateFavorites(updatedFavorites);
    }
  }

  removeFavorite(characterId: number) {
    const currentFavorites = this.getCurrentFavorites();
    const updatedFavorites = currentFavorites.filter(
      (char) => char.id !== characterId
    );
    this.updateFavorites(updatedFavorites);
  }

  toggleFavorite(character: Character) {
    if (this.isFavorite(character.id)) {
      this.removeFavorite(character.id);
    } else {
      this.addFavorite(character);
    }
  }

  isFavorite(characterId: number): boolean {
    const currentFavorites = this.getCurrentFavorites();
    return currentFavorites.some((char) => char.id === characterId);
  }

  getFavoritesCount(): number {
    return this.getCurrentFavorites().length;
  }

  clearAllFavorites(): void {
    this.updateFavorites([]);
  }

  destroy(): void {
    this.channel.close();
  }

  private updateFavorites(favorites: Character[]): void {
    this.favoritesSubject.next(favorites);
    this.saveToStorage(favorites);

    this.channel.postMessage({
      type: 'FAVORITES_UPDATED',
      timestamp: Date.now(),
    });
  }

  private loadFromStorage(): Character[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar favoritos do storage:', error);
      return [];
    }
  }

  private saveToStorage(favorites: Character[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos no storage:', error);
    }
  }
}
