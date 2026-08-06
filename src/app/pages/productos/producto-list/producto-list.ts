import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductoService, Producto } from '../../../services/producto';
import { Boton } from '../../../shared/boton/boton';

@Component({
  selector: 'app-producto-list',
  standalone: true,
  imports: [CommonModule, Boton],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css'
})
export class ProductoList implements OnInit {
  productos = signal<Producto[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  constructor(private productoService: ProductoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando.set(true);
    this.productoService.listar().subscribe({
      next: (data) => { this.productos.set(data); this.cargando.set(false); },
      error: (err) => { this.error.set('No se pudo conectar con el servidor.'); this.cargando.set(false); console.error(err); }
    });
  }

  nuevoProducto(): void {
    this.router.navigate(['/productos/nuevo']);
  }

  editarProducto(id: number): void {
    this.router.navigate(['/productos/editar', id]);
  }

  eliminarProducto(id: number): void {
    if (!confirm('Seguro que deseas eliminar este producto?')) return;
    this.productoService.eliminar(id).subscribe({
      next: () => this.productos.set(this.productos().filter(p => p.id !== id)),
      error: (err) => { alert('Error al eliminar.'); console.error(err); }
    });
  }
}
