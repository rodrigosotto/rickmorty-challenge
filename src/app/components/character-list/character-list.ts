import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../services/character.service';
import { FavoriteService } from '../../services/favorites.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  templateUrl: './character-list.html',
  styleUrl: './character-list.scss',
})
export class CharacterList implements OnInit {

  characters: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private characterService: CharacterService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    this.loading = true;
    this.characterService
      .getCharacters(this.currentPage, this.searchTerm)
      .subscribe({
        next: (response) => {
          this.characters = response.results;
          this.totalPages = response.info.pages;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar personagens. Tente novamente.';
          this.loading = false;
          console.error('Erro ao carregar personagens:', err);
        },
      });
  }

  search(): void {
    this.currentPage = 1;
    this.loadCharacters();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCharacters();
    }
  }

  getPageNumbers(): number[] {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  toggleFavorite(character: any): void {
    this.favoriteService.toggleFavorite(character);
  }

  isFavorite(character: any): boolean {
    return this.favoriteService.isFavorite(character.id);
  }
}
