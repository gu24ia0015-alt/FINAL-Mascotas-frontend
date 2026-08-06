import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CitaService, Cita } from '../../../services/cita';
import { Boton } from '../../../shared/boton/boton';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, Boton],
  templateUrl: './cita-list.html',
  styleUrl: './cita-list.css'
})
export class CitaList implements OnInit {
  citas = signal<Cita[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  constructor(private citaService: CitaService, private router: Router) {}

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

  nuevaCita(): void {
    this.router.navigate(['/citas/nuevo']);
  }

  editarCita(id: number): void {
    this.router.navigate(['/citas/editar', id]);
  }

  eliminarCita(id: number): void {
    if (!confirm('Seguro que deseas eliminar esta cita?')) return;
    this.citaService.eliminar(id).subscribe({
      next: () => this.citas.set(this.citas().filter(c => c.id !== id)),
      error: (err) => { alert('Error al eliminar.'); console.error(err); }
    });
  }
}
