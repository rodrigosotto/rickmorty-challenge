import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { FavoriteService } from '../../services/favorites.service';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.scss',
})
export class CharacterDetail implements OnInit {
  character: any = null;
  episodes: any[] = [];
  loading: boolean = false;
  error: string | null = null;
  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private characterService: CharacterService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      this.loadCharacter(id);
    });
  }

  loadCharacter(id: number): void {
    this.characterService.getCharacter(id).subscribe({
      next: (character) => {
        this.character = character;
        this.isFavorite = this.favoriteService.isFavorite(character.id);
        this.loadEpisodes(character.episode);
      },
      error: (err) => {
        this.error = 'Erro ao carregar detalhes do personagem.';
        this.loading = false;
        console.error('Erro ao carregar personagem:', err);
      },
    });
  }

  loadEpisodes(episodeUrls: string[]): void {
    if (episodeUrls.length === 0) {
      this.loading = false;
      return;
    }

    this.characterService.getEpisodes(episodeUrls).subscribe({
      next: (episodes) => {
        // Se apenas um episódio for retornado, a API retorna um objeto em vez de um array
        this.episodes = Array.isArray(episodes) ? episodes : [episodes];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar episódios.';
        this.loading = false;
        console.error('Erro ao carregar episódios:', err);
      },
    });
  }

  toggleFavorite(): void {
    if (this.character) {
      this.favoriteService.toggleFavorite(this.character);
      this.isFavorite = this.favoriteService.isFavorite(this.character.id);
    }
  }
}
