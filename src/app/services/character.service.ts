import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private apiUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  getCharacters(page: number = 1, name: string = ''): Observable<any> {
    let url = `${this.apiUrl}/character/?page=${page}`;
    if (name) {
      url += `&name=${name}`;
    }
    return this.http.get(url);
  }

  getCharacter(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/character/${id}`);
  }

  getEpisodes(episodeUrls: string[]): Observable<any> {
    const episodeIds = episodeUrls.map((url) => url.split('/').pop());
    return this.http.get(`${this.apiUrl}/episode/${episodeIds}`);
  }
}
