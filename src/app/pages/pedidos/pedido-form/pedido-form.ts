import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PedidoService, Pedido } from '../../../services/pedido';
import { ClienteService, Cliente } from '../../../services/cliente';
import { NavegacionService } from '../../../services/navegacion';
import { Boton } from '../../../shared/boton/boton';
import { environment } from '../../../../environments/environment';

interface Direccion { id: number; calle: string; ciudad: string; cliente: number; }

@Component({
  selector: 'app-pedido-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Boton],
  templateUrl: './pedido-form.html',
  styleUrl: './pedido-form.css'
})
export class PedidoForm implements OnInit {
  esEdicion = signal<boolean>(false);
  pedidoId: number | null = null;
  cargando = signal<boolean>(false);
  error = signal<string>('');

  clientes = signal<Cliente[]>([]);
  direcciones = signal<Direccion[]>([]);
  direccionesFiltradas = signal<Direccion[]>([]);

  clienteId = signal<number | null>(null);
  direccionId = signal<number | null>(null);
  estado = signal<string>('pendiente');
  subtotal = signal<number>(0);
  total = signal<number>(0);
  metodoPago = signal<string>('Tarjeta de credito');

  constructor(
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private http: HttpClient,
    public nav: NavegacionService
  ) {}

  ngOnInit(): void {
    this.clienteService.listar().subscribe({ next: (d) => this.clientes.set(d) });
    this.http.get<Direccion[]>(`${environment.apiUrl}/direcciones/`).subscribe({
      next: (d) => {
        this.direcciones.set(d);
        if (this.clienteId()) {
          this.direccionesFiltradas.set(d.filter(dir => dir.cliente === this.clienteId()));
        }
      },
      error: () => {}
    });

    const id = this.nav.idSeleccionado();
    if (id) {
      this.esEdicion.set(true);
      this.pedidoId = id;
      this.cargarPedido(id);
    }
  }

  onClienteChange(id: number): void {
    this.clienteId.set(id);
    this.direccionesFiltradas.set(this.direcciones().filter(d => d.cliente === id));
  }

  cargarPedido(id: number): void {
    this.cargando.set(true);
    this.pedidoService.obtener(id).subscribe({
      next: (data) => {
        this.clienteId.set(data.cliente);
        this.direccionId.set(data.direccion);
        this.estado.set(data.estado ?? 'pendiente');
        this.subtotal.set(data.subtotal);
        this.total.set(data.total);
        this.metodoPago.set(data.metodo_pago ?? '');
        this.direccionesFiltradas.set(this.direcciones().filter(d => d.cliente === data.cliente));
        this.cargando.set(false);
      },
      error: (err) => { this.error.set('No se pudo cargar el pedido.'); this.cargando.set(false); console.error(err); }
    });
  }

  guardar(): void {
    if (!this.clienteId() || !this.direccionId()) {
      this.error.set('Selecciona un cliente y una direccion.');
      return;
    }

    const pedido: Pedido = {
      cliente: this.clienteId()!,
      direccion: this.direccionId()!,
      estado: this.estado(),
      subtotal: this.subtotal(),
      total: this.total(),
      metodo_pago: this.metodoPago()
    };

    this.cargando.set(true);
    const peticion = this.esEdicion()
      ? this.pedidoService.actualizar(this.pedidoId!, pedido)
      : this.pedidoService.crear(pedido);

    peticion.subscribe({
      next: () => this.nav.volverALista(),
      error: (err) => { this.error.set('Error al guardar el pedido.'); this.cargando.set(false); console.error(err); }
    });
  }

  cancelar(): void {
    this.nav.volverALista();
  }
}
