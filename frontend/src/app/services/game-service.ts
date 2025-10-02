import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  endpoint = 'http://localhost:8080/api/games';

  gamesUpdated = new EventEmitter<void>();

  constructor(private httpClient: HttpClient) { }

  getGames() {
    return this.httpClient.get(this.endpoint);
  }

  getGameById(id: number) {
    return this.httpClient.get(`${this.endpoint}/${id}`);
  }

  createGame(gameData: any) {
    return this.httpClient.post(`${this.endpoint}`, gameData).pipe(
      tap(() => {
        this.gamesUpdated.emit();
      })
    );
  }

  updateGame(id: number, gameData: any) {
    return this.httpClient.put(`${this.endpoint}/${id}`, gameData).pipe(
      tap(() => {
        this.gamesUpdated.emit();
      })
    );
  }

  deleteGame(id: number) {
    return this.httpClient.delete(`${this.endpoint}/${id}`).pipe(
      tap(() => {
        this.gamesUpdated.emit();
      })
    );
  }

  notifyGamesUpdated() {
    this.gamesUpdated.emit();
  }
}