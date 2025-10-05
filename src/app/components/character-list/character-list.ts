import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  of,
  BehaviorSubject,
} from 'rxjs';
import { CharacterService, Character } from '../../services/character.service';
import { FavoriteService } from '../../services/favorites.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    TranslatePipe,
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
  private searchSubject = new BehaviorSubject<string>('');

  constructor(
    private characterService: CharacterService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.setupSearch();
    this.setupFavorites();
  }

  private setupSearch(): void {
    // Busca com RxJS
    this.searchSubject
      .pipe(
        debounceTime(300), // Aguarda 300ms após parar de digitar
        distinctUntilChanged(), // Só faz nova busca se o termo mudou
        switchMap((searchTerm) => {
          this.loading = true;
          this.currentPage = 1;
          this.characters = [];

          return this.characterService.getCharacters(1, searchTerm).pipe(
            catchError((err) => {
              this.error = 'Erro ao buscar personagens. Tente novamente.';
              console.error('Erro na busca:', err);
              return of({
                info: { count: 0, pages: 0, next: null, prev: null },
                results: [],
              });
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          this.characters = response.results;
          this.totalPages = response.info.pages;
          this.hasMore = this.currentPage < this.totalPages;
          this.loading = false;
          this.error = null;
        },
      });

    // Inicia a primeira busca
    this.searchSubject.next('');
  }

  private setupFavorites(): void {
    this.favoriteService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe((favorites) => {
        this.favoriteIds = new Set(favorites.map((f) => f.id));
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

  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  // Função trackBy para otimizar *ngFor
  trackByCharacterId(index: number, character: Character): number {
    return character.id;
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
