import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  endpoint = 'http://localhost:8080/api/games';

  constructor(private httpClient: HttpClient) { }

  getGames() {
    return this.httpClient.get(this.endpoint);
  }

  getGameById(id: number) {
    return this.httpClient.get(`${this.endpoint}/${id}`);
  }

  createGame(gameData: any) {
    return this.httpClient.post(this.endpoint, gameData);
  }

  updateGame(id: number, gameData: any) {
    return this.httpClient.put(`${this.endpoint}/${id}`, gameData);
  }

  deleteGame(id: number) {
    return this.httpClient.delete(`${this.endpoint}/${id}`);
  }
}