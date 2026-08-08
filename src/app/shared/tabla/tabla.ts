import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Boton } from '../boton/boton';

export interface ColumnaTabla {
  clave: string;
  etiqueta: string;
  tipo?: 'texto' | 'booleano' | 'moneda';
}

@Component({
  selector: 'app-tabla',
  standalone: true,
  imports: [CommonModule, Boton],
  templateUrl: './tabla.html',
  styleUrl: './tabla.css'
})
export class Tabla {
  @Input() columnas: ColumnaTabla[] = [];
  @Input() datos: any[] = [];
  @Output() editar = new EventEmitter<any>();
  @Output() eliminar = new EventEmitter<any>();

  valor(fila: any, columna: ColumnaTabla): string {
    const v = fila[columna.clave];
    if (columna.tipo === 'booleano') return v ? 'Si' : 'No';
    if (columna.tipo === 'moneda') return '$' + v;
    return v ?? '';
  }
}
