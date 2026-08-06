import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Boton } from './shared/boton/boton';
import { CampoInput } from './shared/input/input';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Boton, CampoInput],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend-mascotas';
}
