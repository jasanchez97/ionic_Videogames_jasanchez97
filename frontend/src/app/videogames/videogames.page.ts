import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game-service';

@Component({
  selector: 'app-videogames',
  templateUrl: './videogames.page.html',
  styleUrls: ['./videogames.page.scss'],
  standalone: false
})
export class VideogamesPage implements OnInit {

  games: any[] = [];

  constructor(
    private gameService: GameService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadGames();
  }

  ionViewWillEnter() {
    this.loadGames();
  }

  loadGames() {
    this.gameService.getGames().subscribe((response: any) => {
      this.games = response;
    });
  }

  editGame(id: number) {
    this.router.navigate(['/videogames-form', id]);
  }

  deleteGame(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      this.gameService.deleteGame(id).subscribe({
        next: (response) => {
          console.log('Juego eliminado: ', response);
          this.loadGames();
        },
        error: (error) => {
          console.error('Error eliminando el juego: ', error);
        }
      });
    }
  }
}