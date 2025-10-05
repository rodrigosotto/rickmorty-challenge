import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../services/favorites.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  favoriteCount: number = 0;

  constructor(private favoriteService: FavoriteService) {
    this.favoriteService.getFavorites().subscribe(favorites => {
      this.favoriteCount = favorites.length;
    });
  }
}
