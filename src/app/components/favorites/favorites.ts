import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { FavoriteService, Character } from '../../services/favorites.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe, TranslatePipe],
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
  }

  removeFromFavorites(character: Character): void {
    this.favoriteService.removeFavorite(character.id);
  }

  clearAll(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '580px',
      data: {
        title: 'Remover Todos os Favoritos',
        message: 'Tem certeza que deseja remover TODOS os favoritos?',
        confirmText: 'Sim, remover tudo',
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
