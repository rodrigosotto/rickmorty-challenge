import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FavoriteService } from '../../services/favorites.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {
  favoriteCount: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    // Se inscreve no Observable de favoritos
    this.favoriteService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.favoriteCount = favorites.length;
      });
  }

  ngOnDestroy(): void {
    // Completa o Subject para cancelar todas as subscrições
    this.destroy$.next();
    this.destroy$.complete();
  }
}
