import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './input.html',
  styleUrl: './input.css'
})
export class CampoInput {
  @Input() etiqueta: string = '';
  @Input() tipo: string = 'text';
  @Input() placeholder: string = '';
  @Input() valor: string = '';
  @Input() requerido: boolean = false;
  @Output() valorCambio = new EventEmitter<string>();

  onInput(event: Event) {
    const nuevoValor = (event.target as HTMLInputElement).value;
    this.valorCambio.emit(nuevoValor);
  }
}
