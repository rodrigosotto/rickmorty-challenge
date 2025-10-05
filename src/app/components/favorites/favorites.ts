import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { FavoriteService, Character } from '../../services/favorites.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  favorites$: Observable<Character[]>;

  constructor(
    private favoriteService: FavoriteService,
    private dialog: MatDialog
  ) {
    this.favorites$ = this.favoriteService.favorites$;

    // DEBUG: Log para verificar se está recebendo atualizações
    this.favorites$.subscribe((favs) => {
      console.log('Favoritos atualizados em tempo real:', favs.length);
    });
  }

  removeFromFavorites(character: Character): void {
    this.favoriteService.removeFavorite(character.id);
  }

  clearAll(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: 'Limpar Todos os Favoritos',
        message: 'Tem certeza que deseja remover TODOS os favoritos?',
        confirmText: 'Sim, limpar tudo',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.favoriteService.clearAllFavorites();
      }
    });
  }
}
