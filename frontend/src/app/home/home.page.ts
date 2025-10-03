import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game-service';

interface Game {
  id?: number;
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

  premiereGames: Game[] = [];
  availableGames: Game[] = [];

  constructor(private router: Router, private gameService: GameService) { }

  ngOnInit() {
    this.loadGamesFromService();

    this.gameService.gamesUpdated.subscribe(() => {
      this.loadGamesFromService();
    });

    this.intervalId = setInterval(() => {
      this.checkGameReleases();
    }, 60 * 60 * 1000);
  }

  loadGamesFromService() {
    this.gameService.getGames().subscribe({
      next: (games: any) => {
        this.processGames(games);
      },
      error: (error) => {
        console.error('Error al cargar juegos:', error);
        this.loadFromLocalStorage();
      }
    });
  }

  private processGames(games: any[]) {
    this.premiereGames = [];
    this.availableGames = [];

    if (games && Array.isArray(games)) {
      games.forEach((game: any) => {
        const gameWithReleaseStatus: Game = {
          id: game.id,
          name: game.name,
          subtitle: game.subtitle,
          developer: game.developer,
          releaseDate: game.releaseDate,
          category: game.category,
          stock: game.stock,
          isReleased: this.isGameReleased(game.releaseDate)
        };

        if (gameWithReleaseStatus.isReleased) {
          this.availableGames.push(gameWithReleaseStatus);
        } else {
          this.premiereGames.push(gameWithReleaseStatus);
        }
      });

      this.saveToLocalStorage();
    }

    if (this.premiereGames.length === 0 && this.availableGames.length === 0) {
      this.loadDefaultGames();
    }
  }

  private isGameReleased(releaseDate: string): boolean {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const release = this.parseDate(releaseDate);
    return release <= currentDate;
  }

  private loadDefaultGames() {
    this.premiereGames = [
      {
        name: "Resident Evil Requiem",
        subtitle: "requiem",
        developer: "CAPCOM",
        releaseDate: "27/02/2026",
        category: "Supervivencia, Horror",
        isReleased: false
      }
    ];

    this.availableGames = [
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
  }

  private parseDate(dateString: string): Date {
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      return date;
    } else if (dateString.includes('-')) {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    return new Date(0);
  }

  private checkGameReleases() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const gamesToMove: Game[] = [];

    this.premiereGames.forEach((game) => {
      const releaseDate = this.parseDate(game.releaseDate);

      if (releaseDate <= currentDate) {
        gamesToMove.push(game);
      }
    });

    gamesToMove.forEach(game => {
      const gameIndex = this.premiereGames.findIndex(g => g.id === game.id || g.name === game.name);
      if (gameIndex > -1) {
        const movedGame = this.premiereGames.splice(gameIndex, 1)[0];
        movedGame.isReleased = true;
        this.availableGames.push(movedGame);
      }
    });

    this.saveToLocalStorage();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getGameImagePath(gameName: string): string {
    if (!gameName) {
      return '../../assets/img/default-game.webp';
    }

    const imageName = gameName.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]/g, '');

    return `../../assets/img/${imageName}.webp`;
  }

  onImageError(event: any) {
    event.target.src = '../../assets/img/default-game.webp';
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