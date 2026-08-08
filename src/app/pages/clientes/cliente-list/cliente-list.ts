import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService, Cliente } from '../../../services/cliente';
import { NavegacionService } from '../../../services/navegacion';
import { Boton } from '../../../shared/boton/boton';
import { Tabla, ColumnaTabla } from '../../../shared/tabla/tabla';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, Boton, Tabla],
  templateUrl: './cliente-list.html',
  styleUrl: './cliente-list.css'
})
export class ClienteList implements OnInit {
  clientes = signal<Cliente[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  columnas: ColumnaTabla[] = [
    { clave: 'nombre', etiqueta: 'Nombre' },
    { clave: 'apellido', etiqueta: 'Apellido' },
    { clave: 'email', etiqueta: 'Email' },
    { clave: 'telefono', etiqueta: 'Telefono' },
    { clave: 'activo', etiqueta: 'Activo', tipo: 'booleano' },
  ];

  constructor(private clienteService: ClienteService, public nav: NavegacionService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando.set(true);
    this.clienteService.listar().subscribe({
      next: (data) => { this.clientes.set(data); this.cargando.set(false); },
      error: (err) => { this.error.set('No se pudo conectar con el servidor.'); this.cargando.set(false); console.error(err); }
    });
  }

  nuevoCliente(): void { this.nav.irANuevo(); }
  editarCliente(fila: Cliente): void { this.nav.irAEditar(fila.id!); }

  eliminarCliente(fila: Cliente): void {
    if (!confirm('Seguro que deseas eliminar este cliente?')) return;
    this.clienteService.eliminar(fila.id!).subscribe({
      next: () => this.clientes.set(this.clientes().filter(c => c.id !== fila.id)),
      error: (err) => { alert('Error al eliminar.'); console.error(err); }
    });
  }
}
