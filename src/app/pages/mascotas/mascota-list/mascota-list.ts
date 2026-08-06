import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService, Mascota } from '../../../services/mascota';
import { NavegacionService } from '../../../services/navegacion';
import { Boton } from '../../../shared/boton/boton';

@Component({
  selector: 'app-mascota-list',
  standalone: true,
  imports: [CommonModule, Boton],
  templateUrl: './mascota-list.html',
  styleUrl: './mascota-list.css'
})
export class MascotaList implements OnInit {
  mascotas = signal<Mascota[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  constructor(private mascotaService: MascotaService, public nav: NavegacionService) {}

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas(): void {
    this.cargando.set(true);
    this.mascotaService.listar().subscribe({
      next: (data) => { this.mascotas.set(data); this.cargando.set(false); },
      error: (err) => { this.error.set('No se pudo conectar con el servidor.'); this.cargando.set(false); console.error(err); }
    });
  }

  nuevaMascota(): void {
    this.nav.irANuevo();
  }

  editarMascota(id: number): void {
    this.nav.irAEditar(id);
  }

  eliminarMascota(id: number): void {
    if (!confirm('Seguro que deseas eliminar esta mascota?')) return;
    this.mascotaService.eliminar(id).subscribe({
      next: () => this.mascotas.set(this.mascotas().filter(m => m.id !== id)),
      error: (err) => { alert('Error al eliminar.'); console.error(err); }
    });
  }
}
