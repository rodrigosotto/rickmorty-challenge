import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private favorites: any[] = [];
  private favoritesSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
      this.favoritesSubject.next(this.favorites);
    }
  }

  private saveFavorites(): void {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
    this.favoritesSubject.next(this.favorites);
  }

  getFavorites() {
    return this.favoritesSubject.asObservable();
  }

  addFavorite(character: any): void {
    if (!this.isFavorite(character.id)) {
      this.favorites.push(character);
      this.saveFavorites();
    }
  }

  removeFavorite(id: number): void {
    const index = this.favorites.findIndex((char) => char.id === id);
    if (index !== -1) {
      this.favorites.splice(index, 1);
      this.saveFavorites();
    }
  }

  toggleFavorite(character: any): void {
    if (this.isFavorite(character.id)) {
      this.removeFavorite(character.id);
    } else {
      this.addFavorite(character);
    }
  }

  isFavorite(id: number): boolean {
    return this.favorites.some((char) => char.id === id);
  }
}
