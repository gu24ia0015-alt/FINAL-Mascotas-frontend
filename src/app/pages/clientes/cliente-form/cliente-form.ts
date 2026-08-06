import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente } from '../../../services/cliente';
import { NavegacionService } from '../../../services/navegacion';
import { Boton } from '../../../shared/boton/boton';
import { CampoInput } from '../../../shared/input/input';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Boton, CampoInput],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.css'
})
export class ClienteForm implements OnInit {
  esEdicion = signal<boolean>(false);
  clienteId: number | null = null;
  cargando = signal<boolean>(false);
  error = signal<string>('');

  nombre = signal<string>('');
  apellido = signal<string>('');
  email = signal<string>('');
  telefono = signal<string>('');
  dni = signal<string>('');
  fecha_nacimiento = signal<string>('');
  genero = signal<string>('M');
  activo = signal<boolean>(true);
  password_hash = signal<string>('');

  constructor(private clienteService: ClienteService, public nav: NavegacionService) {}

  ngOnInit(): void {
    const id = this.nav.idSeleccionado();
    if (id) {
      this.esEdicion.set(true);
      this.clienteId = id;
      this.cargarCliente(id);
    }
  }

  cargarCliente(id: number): void {
    this.cargando.set(true);
    this.clienteService.obtener(id).subscribe({
      next: (data) => {
        this.nombre.set(data.nombre);
        this.apellido.set(data.apellido);
        this.email.set(data.email);
        this.telefono.set(data.telefono);
        this.dni.set(data.dni);
        this.fecha_nacimiento.set(data.fecha_nacimiento ?? '');
        this.genero.set(data.genero ?? 'M');
        this.activo.set(data.activo ?? true);
        this.cargando.set(false);
      },
      error: (err) => { this.error.set('No se pudo cargar el cliente.'); this.cargando.set(false); console.error(err); }
    });
  }

  guardar(): void {
    const cliente: Cliente = {
      nombre: this.nombre(),
      apellido: this.apellido(),
      email: this.email(),
      telefono: this.telefono(),
      dni: this.dni(),
      fecha_nacimiento: this.fecha_nacimiento(),
      genero: this.genero(),
      activo: this.activo(),
      password_hash: this.password_hash() || 'temporal123'
    };

    this.cargando.set(true);
    const peticion = this.esEdicion()
      ? this.clienteService.actualizar(this.clienteId!, cliente)
      : this.clienteService.crear(cliente);

    peticion.subscribe({
      next: () => this.nav.volverALista(),
      error: (err) => { this.error.set('Error al guardar el cliente.'); this.cargando.set(false); console.error(err); }
    });
  }

  cancelar(): void {
    this.nav.volverALista();
  }
}
