import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClienteService, Cliente } from '../../../services/cliente';
import { Boton } from '../../../shared/boton/boton';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, Boton],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css'
})
export class ClienteList implements OnInit {
  clientes = signal<Cliente[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  constructor(private clienteService: ClienteService, private router: Router) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando.set(true);
    this.clienteService.listar().subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('No se pudo conectar con el servidor. Verifica que Django este corriendo.');
        this.cargando.set(false);
        console.error(err);
      }
    });
  }

  nuevoCliente(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  editarCliente(id: number): void {
    this.router.navigate(['/clientes/editar', id]);
  }

  eliminarCliente(id: number): void {
    if (!confirm('Seguro que deseas eliminar este cliente?')) return;

    this.clienteService.eliminar(id).subscribe({
      next: () => {
        this.clientes.set(this.clientes().filter(c => c.id !== id));
      },
      error: (err) => {
        alert('Error al eliminar el cliente.');
        console.error(err);
      }
    });
  }
}
