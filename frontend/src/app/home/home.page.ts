import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

interface Game {
  name: string;
  subtitle?: string;
  developer: string;
  releaseDate: string;
  category: string;
  stock?: number;
  isReleased: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  private intervalId: any;

  premiereGames: Game[] = [
    {
      name: "Resident Evil Requiem",
      developer: "CAPCOM",
      releaseDate: "27/02/2026",
      category: "Supervivencia, Horror",
      isReleased: false
    }
  ];

  availableGames: Game[] = [
    {
      name: "Kingdom Hearts",
      subtitle: "All in One",
      developer: "Square Enix",
      releaseDate: "17/03/2020",
      category: "Rol de acción",
      stock: 12,
      isReleased: true
    },
    {
      name: "Dying Light",
      developer: "Techland",
      releaseDate: "26/01/2015",
      category: "Supervivencia, Horror, Disparos",
      stock: 20,
      isReleased: true
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    this.checkGameReleases();
    this.intervalId = setInterval(() => {
      this.checkGameReleases();
    }, 24 * 60 * 60 * 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getGameImagePath(gameName: string): string {
    const imageName = gameName.toLowerCase().replace(/ /g, '-');
    return `../../assets/img/${imageName}.webp`;
  }

  onImageError(event: any) {
    event.target.src = '../../assets/img/default-game.webp';
  }

  private checkGameReleases() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const gamesToMove: Game[] = [];

    this.premiereGames.forEach((game, index) => {
      const releaseDate = this.parseDate(game.releaseDate);

      if (releaseDate <= currentDate) {
        gamesToMove.push(game);
      }
    });

    gamesToMove.forEach(game => {
      const gameIndex = this.premiereGames.findIndex(g => g.name === game.name);
      if (gameIndex > -1) {
        const movedGame = this.premiereGames.splice(gameIndex, 1)[0];
        movedGame.isReleased = true;
        this.availableGames.push(movedGame);
      }
    });

    this.saveToLocalStorage();
  }

  private parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private saveToLocalStorage() {
    localStorage.setItem('premiereGames', JSON.stringify(this.premiereGames));
    localStorage.setItem('availableGames', JSON.stringify(this.availableGames));
  }

  private loadFromLocalStorage() {
    const savedPremiere = localStorage.getItem('premiereGames');
    const savedAvailable = localStorage.getItem('availableGames');

    if (savedPremiere) {
      this.premiereGames = JSON.parse(savedPremiere);
    }
    if (savedAvailable) {
      this.availableGames = JSON.parse(savedAvailable);
    }
  }

  gotoMyVideogames() {
    this.router.navigateByUrl("/videogames");
  }
}