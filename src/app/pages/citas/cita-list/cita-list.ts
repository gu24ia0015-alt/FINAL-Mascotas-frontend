import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService, Cita } from '../../../services/cita';
import { NavegacionService } from '../../../services/navegacion';
import { Boton } from '../../../shared/boton/boton';
import { Tabla, ColumnaTabla } from '../../../shared/tabla/tabla';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, Boton, Tabla],
  templateUrl: './cita-list.html',
  styleUrl: './cita-list.css'
})
export class CitaList implements OnInit {
  citas = signal<Cita[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  columnas: ColumnaTabla[] = [
    { clave: 'mascota_nombre', etiqueta: 'Mascota' },
    { clave: 'veterinario_nombre', etiqueta: 'Veterinario' },
    { clave: 'servicio_nombre', etiqueta: 'Servicio' },
    { clave: 'estado', etiqueta: 'Estado' },
  ];

  constructor(private citaService: CitaService, public nav: NavegacionService) {}

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando.set(true);
    this.citaService.listar().subscribe({
      next: (data) => { this.citas.set(data); this.cargando.set(false); },
      error: (err) => { this.error.set('No se pudo conectar con el servidor.'); this.cargando.set(false); console.error(err); }
    });
  }

  nuevaCita(): void { this.nav.irANuevo(); }
  editarCita(fila: Cita): void { this.nav.irAEditar(fila.id!); }

  eliminarCita(fila: Cita): void {
    if (!confirm('Seguro que deseas eliminar esta cita?')) return;
    this.citaService.eliminar(fila.id!).subscribe({
      next: () => this.citas.set(this.citas().filter(c => c.id !== fila.id)),
      error: (err) => { alert('Error al eliminar.'); console.error(err); }
    });
  }
}
