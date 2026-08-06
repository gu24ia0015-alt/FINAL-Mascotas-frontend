import { Injectable, signal } from '@angular/core';

export type Modulo = 'clientes' | 'mascotas' | 'productos' | 'pedidos' | 'citas';
export type Vista = 'lista' | 'formulario';

@Injectable({ providedIn: 'root' })
export class NavegacionService {
  modulo = signal<Modulo>('clientes');
  vista = signal<Vista>('lista');
  idSeleccionado = signal<number | null>(null);

  irAModulo(modulo: Modulo): void {
    this.modulo.set(modulo);
    this.vista.set('lista');
    this.idSeleccionado.set(null);
  }

  irANuevo(): void {
    this.vista.set('formulario');
    this.idSeleccionado.set(null);
  }

  irAEditar(id: number): void {
    this.vista.set('formulario');
    this.idSeleccionado.set(id);
  }

  volverALista(): void {
    this.vista.set('lista');
    this.idSeleccionado.set(null);
  }
}
