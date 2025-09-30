import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GameService } from '../services/game-service';

@Component({
  selector: 'app-videogames-form',
  templateUrl: './videogames-form.page.html',
  styleUrls: ['./videogames-form.page.scss'],
  standalone: false
})
export class VideogamesFormPage implements OnInit {
  gameForm: FormGroup;
  isEditing: boolean = false;
  gameId: number | null = null;

  constructor(
    public formBuilder: FormBuilder,
    private gameService: GameService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.gameForm = this.formBuilder.group({
      name: ['', Validators.required],
      developer: ['', Validators.required],
      releaseDate: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditing = true;
        this.gameId = +id;
        this.loadGameData(this.gameId);
      } else {
        this.isEditing = false;
        this.gameId = null;
      }
    });
  }

  createGame() {
    if (this.gameForm.valid) {
      console.log('Formulario válido', this.gameForm.value);
      this.gameService.createGame(this.gameForm.value).subscribe(response => {
        this.router.navigateByUrl("/videogames");
      });
    } else {
      console.log("Formulario no válido");
    }
  }

  updateGame() {
    if (this.gameForm.valid && this.gameId) {
      console.log('Actualizando juego', this.gameForm.value);
      this.gameService.updateGame(this.gameId, this.gameForm.value).subscribe(response => {
        this.router.navigateByUrl("/videogames");
      });
    } else {
      console.log("Formulario no válido o ID no disponible");
    }
  }

  loadGameData(id: number) {
    this.gameService.getGameById(id).subscribe((game: any) => {
      if (game) {
        this.gameForm.patchValue({
          name: game.name,
          developer: game.developer,
          releaseDate: game.releaseDate,
          category: game.category
        });
      }
    }, error => {
      console.error('Error al cargar el videojuego: ', error);
      this.gameService.getGames().subscribe((games: any) => {
        const gameFromList = Array.isArray(games)
          ? games.find((g: any) => g.id === id)
          : null;

        if (gameFromList) {
          this.gameForm.patchValue({
            name: gameFromList.name,
            developer: gameFromList.developer,
            releaseDate: gameFromList.releaseDate,
            category: gameFromList.category
          });
        }
      });
    });
  }

  onSubmit() {
    if (this.isEditing) {
      this.updateGame();
    } else {
      this.createGame();
    }
  }

  getFormControl(field: string) {
    return this.gameForm.get(field);
  }

  getSubmitButtonText(): string {
    return this.isEditing ? 'Actualizar Videojuego' : 'Introducir Videojuego';
  }
}