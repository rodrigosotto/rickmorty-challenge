import { Routes } from '@angular/router';
import { CharacterList } from './components/character-list/character-list';
import { Favorites } from './components/favorites/favorites';

export const routes: Routes = [
  { path: '', redirectTo: 'characters', pathMatch: 'full' },
  { path: 'characters', component: CharacterList },
  { path: 'favorites', component: Favorites },
  { path: '**', redirectTo: 'characters' },
];
