import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  developer: string = "Annapurna Interactive";
  releaseDate: string = "16/04/2024";
  category: string = "Puzzles"

  constructor(private router: Router) { }
  gotoMyVideogames() {
    this.router.navigateByUrl("/videogames");
  }
}
