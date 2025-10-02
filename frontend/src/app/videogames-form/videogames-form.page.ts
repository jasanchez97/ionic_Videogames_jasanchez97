import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  selectedFile: File | null = null;
  fileError: string = '';

  constructor(
    public formBuilder: FormBuilder,
    private gameService: GameService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.gameForm = this.formBuilder.group({
      name: ['', Validators.required],
      subtitle: [''],
      developer: ['', Validators.required],
      releaseDate: ['', [Validators.required, this.dateValidator]],
      category: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]]
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.fileError = '';
    
    if (file) {
      if (file.type !== 'image/webp') {
        this.fileError = 'Solo se permiten archivos .webp';
        this.selectedFile = null;
        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = '';
        }
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.fileError = 'La imagen no puede ser mayor a 5MB';
        this.selectedFile = null;
        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = '';
        }
        return;
      }
      
      this.selectedFile = file;
    }
  }

  createGame() {
    this.gameService.createGame(this.gameForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error creando juego:', error);
      }
    });
  }

  updateGame() {
    if (this.gameId === null) return;
    
    this.gameService.updateGame(this.gameId, this.gameForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error actualizando juego:', error);
      }
    });
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const fechaStr = control.value;
    
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
    if (!regex.test(fechaStr)) {
      return { invalidFormat: true };
    }

    const [dia, mes, anio] = fechaStr.split('/').map(Number);
    const fecha = new Date(anio, mes - 1, dia);
    
    const fechaValida = fecha.getDate() === dia && 
                       fecha.getMonth() === mes - 1 && 
                       fecha.getFullYear() === anio;

    if (!fechaValida) {
      return { invalidDate: true };
    }

    return null;
  }

  onDateInput(event: any) {
    let input = event.target.value;
    
    input = input.replace(/[^0-9/]/g, '');
    
    if (input.length > 2 && input.length <= 4 && !input.includes('/')) {
      input = input.replace(/^(\d{2})/, '$1/');
    } else if (input.length > 5 && input.split('/').length === 2) {
      input = input.replace(/^(\d{2})\/(\d{2})/, '$1/$2/');
      input = input.substring(0, 10);
    }
    
    this.gameForm.patchValue({
      releaseDate: input
    });
  }

  formatDateForSubmit(fechaStr: string): string {
    if (!fechaStr) return '';
    
    const [dia, mes, anio] = fechaStr.split('/');
    return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  loadGameData(id: number) {
    this.gameService.getGameById(id).subscribe((game: any) => {
      if (game) {
        let formattedDate = game.releaseDate;
        if (game.releaseDate && game.releaseDate.includes('-')) {
          const [anio, mes, dia] = game.releaseDate.split('-');
          formattedDate = `${dia}/${mes}/${anio}`;
        }
        
        this.gameForm.patchValue({
          name: game.name,
          subtitle: game.subtitle || '',
          developer: game.developer,
          releaseDate: formattedDate,
          category: game.category,
          stock: game.stock || 0
        });
      }
    }, error => {
      console.error('Error al cargar el videojuego: ', error);
      this.gameService.getGames().subscribe((games: any) => {
        const gameFromList = Array.isArray(games)
          ? games.find((g: any) => g.id === id)
          : null;

        if (gameFromList) {
          let formattedDate = gameFromList.releaseDate;
          if (gameFromList.releaseDate && gameFromList.releaseDate.includes('-')) {
            const [anio, mes, dia] = gameFromList.releaseDate.split('-');
            formattedDate = `${dia}/${mes}/${anio}`;
          }
          
          this.gameForm.patchValue({
            name: gameFromList.name,
            subtitle: gameFromList.subtitle || '',
            developer: gameFromList.developer,
            releaseDate: formattedDate,
            category: gameFromList.category,
            stock: gameFromList.stock || 0
          });
        }
      });
    });
  }

  markAllFieldsAsTouched() {
    Object.keys(this.gameForm.controls).forEach(field => {
      const control = this.gameForm.get(field);
      control?.markAsTouched();
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