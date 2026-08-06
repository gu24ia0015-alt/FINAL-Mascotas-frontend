import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-boton',
  standalone: true,
  imports: [],
  templateUrl: './boton.html',
  styleUrl: './boton.css'
})
export class Boton {
  @Input() texto: string = 'Aceptar';
  @Input() tipo: 'primario' | 'secundario' | 'peligro' = 'primario';
  @Output() clickBoton = new EventEmitter<void>();
}