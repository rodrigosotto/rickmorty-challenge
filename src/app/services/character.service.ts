import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  getCharacters(page: number = 1, name: string = '', status?: string, species?: string, gender?: string): Observable<ApiResponse<Character>> {
    let params = new HttpParams().set('page', page.toString());

    if (name.trim()) {
      params = params.set('name', name.trim());
    }
    if (status) {
      params = params.set('status', status);
    }
    if (species) {
      params = params.set('species', species);
    }
    if (gender) {
      params = params.set('gender', gender);
    }

    return this.http.get<ApiResponse<Character>>(`${this.apiUrl}/character`, { params });
  }

  getCharacter(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/character/${id}`);
  }

  getEpisodes(episodeUrls: string[]): Observable<any> {
    const episodeIds = episodeUrls.map((url) => url.split('/').pop());
    return this.http.get(`${this.apiUrl}/episode/${episodeIds}`);
  }
}
