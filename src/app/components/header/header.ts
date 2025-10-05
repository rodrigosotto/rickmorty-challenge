import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FavoriteService } from '../../services/favorites.service';
import { LanguageSelector } from '../language-selector/language-selector';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, LanguageSelector, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {
  favoriteCount: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.favoriteService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.favoriteCount = favorites.length;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
