import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Boton } from './shared/boton/boton';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Boton],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'frontend-mascotas';
}
