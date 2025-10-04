import { Routes } from '@angular/router';
import { CharacterList } from './components/character-list/character-list';
import { CharacterDetail } from './components/character-detail/character-detail';
import { Favorites } from './services/favorites.service';

export const routes: Routes = [
  { path: '', redirectTo: 'characters', pathMatch: 'full' },
  { path: 'characters', component: CharacterList },
  { path: 'character/:id', component: CharacterDetail },
  { path: 'favorites', component: Favorites },
  { path: '**', redirectTo: 'characters' },
];
