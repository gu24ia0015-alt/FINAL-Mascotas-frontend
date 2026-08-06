import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService, Producto } from '../../../services/producto';
import { Boton } from '../../../shared/boton/boton';
import { CampoInput } from '../../../shared/input/input';
import { environment } from '../../../../environments/environment';

interface Categoria { id: number; nombre: string; }
interface Proveedor { id: number; nombre: string; }

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Boton, CampoInput],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css'
})
export class ProductoForm implements OnInit {
  esEdicion = signal<boolean>(false);
  productoId: number | null = null;
  cargando = signal<boolean>(false);
  error = signal<string>('');

  categorias = signal<Categoria[]>([]);
  proveedores = signal<Proveedor[]>([]);

  nombre = signal<string>('');
  descripcion = signal<string>('');
  sku = signal<string>('');
  marca = signal<string>('');
  precio = signal<number>(0);
  costo = signal<number>(0);
  stock = signal<number>(0);
  categoriaId = signal<number | null>(null);
  proveedorId = signal<number | null>(null);

  constructor(
    private productoService: ProductoService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.http.get<Categoria[]>(`${environment.apiUrl}/categorias/`).subscribe({ next: (d) => this.categorias.set(d), error: () => {} });
    this.http.get<Proveedor[]>(`${environment.apiUrl}/proveedores/`).subscribe({ next: (d) => this.proveedores.set(d), error: () => {} });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion.set(true);
      this.productoId = Number(idParam);
      this.cargarProducto(this.productoId);
    }
  }

  cargarProducto(id: number): void {
    this.cargando.set(true);
    this.productoService.obtener(id).subscribe({
      next: (data) => {
        this.nombre.set(data.nombre);
        this.descripcion.set(data.descripcion ?? '');
        this.sku.set(data.sku);
        this.marca.set(data.marca ?? '');
        this.precio.set(data.precio);
        this.costo.set(data.costo);
        this.stock.set(data.stock);
        this.categoriaId.set(data.categoria);
        this.proveedorId.set(data.proveedor);
        this.cargando.set(false);
      },
      error: (err) => { this.error.set('No se pudo cargar el producto.'); this.cargando.set(false); console.error(err); }
    });
  }

  guardar(): void {
    if (!this.categoriaId() || !this.proveedorId()) {
      this.error.set('Selecciona una categoria y un proveedor.');
      return;
    }

    const producto: Producto = {
      nombre: this.nombre(),
      descripcion: this.descripcion(),
      sku: this.sku(),
      marca: this.marca(),
      precio: this.precio(),
      costo: this.costo(),
      stock: this.stock(),
      categoria: this.categoriaId()!,
      proveedor: this.proveedorId()!
    };

    this.cargando.set(true);
    const peticion = this.esEdicion()
      ? this.productoService.actualizar(this.productoId!, producto)
      : this.productoService.crear(producto);

    peticion.subscribe({
      next: () => this.router.navigate(['/productos']),
      error: (err) => { this.error.set('Error al guardar el producto.'); this.cargando.set(false); console.error(err); }
    });
  }

  cancelar(): void {
    this.router.navigate(['/productos']);
  }
}
