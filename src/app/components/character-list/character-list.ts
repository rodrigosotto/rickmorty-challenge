import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CharacterService } from '../../services/character.service';
import { FavoriteService, Character } from '../../services/favorites.service';
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
export class CharacterList implements OnInit, OnDestroy {
  characters: Character[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 0;
  loading: boolean = false;
  error: string | null = null;
  hasMore: boolean = true;

  private destroy$ = new Subject<void>();
  private favoriteIds = new Set<number>();

  constructor(
    private characterService: CharacterService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loadCharacters();

    // Se inscreve nos favoritos para atualizar a UI em tempo real
    this.favoriteService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.favoriteIds = new Set(favorites.map(f => f.id));
      });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const scrollPosition = window.innerHeight + window.scrollY;
    const scrollThreshold = document.documentElement.scrollHeight - 200;

    if (scrollPosition >= scrollThreshold && !this.loading && this.hasMore) {
      this.loadMoreCharacters();
    }
  }

  loadCharacters(): void {
    this.loading = true;
    this.currentPage = 1;
    this.characters = [];

    this.characterService
      .getCharacters(this.currentPage, this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.characters = response.results;
          this.totalPages = response.info.pages;
          this.hasMore = this.currentPage < this.totalPages;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar personagens. Tente novamente.';
          this.loading = false;
          console.error('Erro ao carregar personagens:', err);
        },
      });
  }

  loadMoreCharacters(): void {
    if (this.currentPage >= this.totalPages) {
      this.hasMore = false;
      return;
    }

    this.loading = true;
    this.currentPage++;

    this.characterService
      .getCharacters(this.currentPage, this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.characters = [...this.characters, ...response.results];
          this.hasMore = this.currentPage < this.totalPages;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar mais personagens.';
          this.loading = false;
          console.error('Erro ao carregar mais personagens:', err);
        },
      });
  }

  search(): void {
    this.loadCharacters();
  }

  toggleFavorite(character: Character): void {
    this.favoriteService.toggleFavorite(character);
  }

  isFavorite(character: Character): boolean {
    return this.favoriteIds.has(character.id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
