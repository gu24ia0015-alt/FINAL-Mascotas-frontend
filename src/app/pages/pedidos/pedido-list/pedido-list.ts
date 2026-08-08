import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoService, Pedido } from '../../../services/pedido';
import { NavegacionService } from '../../../services/navegacion';
import { Boton } from '../../../shared/boton/boton';
import { Tabla, ColumnaTabla } from '../../../shared/tabla/tabla';

@Component({
  selector: 'app-pedido-list',
  standalone: true,
  imports: [CommonModule, Boton, Tabla],
  templateUrl: './pedido-list.html',
  styleUrl: './pedido-list.css'
})
export class PedidoList implements OnInit {
  pedidos = signal<Pedido[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  columnas: ColumnaTabla[] = [
    { clave: 'id', etiqueta: 'ID' },
    { clave: 'cliente_nombre', etiqueta: 'Cliente' },
    { clave: 'estado', etiqueta: 'Estado' },
    { clave: 'total', etiqueta: 'Total', tipo: 'moneda' },
  ];

  constructor(private pedidoService: PedidoService, public nav: NavegacionService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.cargando.set(true);
    this.pedidoService.listar().subscribe({
      next: (data) => { this.pedidos.set(data); this.cargando.set(false); },
      error: (err) => { this.error.set('No se pudo conectar con el servidor.'); this.cargando.set(false); console.error(err); }
    });
  }

  nuevoPedido(): void { this.nav.irANuevo(); }
  editarPedido(fila: Pedido): void { this.nav.irAEditar(fila.id!); }

  eliminarPedido(fila: Pedido): void {
    if (!confirm('Seguro que deseas eliminar este pedido?')) return;
    this.pedidoService.eliminar(fila.id!).subscribe({
      next: () => this.pedidos.set(this.pedidos().filter(p => p.id !== fila.id)),
      error: (err) => { alert('Error al eliminar.'); console.error(err); }
    });
  }
}
