import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game-service';
import { AlertController } from '@ionic/angular';

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
    private router: Router,
    private alertController: AlertController,
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

  async deleteGame(id: number, gameName: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que quieres eliminar "${gameName}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.confirmDelete(id);
          }
        }
      ]
    });

    await alert.present();
  }

  confirmDelete(id: number) {
    this.gameService.deleteGame(id).subscribe({
      next: (response) => {
        console.log('Juego eliminado:', response);
        this.loadGames();
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
      }
    });
  }
}