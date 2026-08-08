import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService, Mascota } from '../../../services/mascota';
import { NavegacionService } from '../../../services/navegacion';
import { Boton } from '../../../shared/boton/boton';
import { Tabla, ColumnaTabla } from '../../../shared/tabla/tabla';

@Component({
  selector: 'app-mascota-list',
  standalone: true,
  imports: [CommonModule, Boton, Tabla],
  templateUrl: './mascota-list.html',
  styleUrl: './mascota-list.css'
})
export class MascotaList implements OnInit {
  mascotas = signal<Mascota[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');

  columnas: ColumnaTabla[] = [
    { clave: 'nombre', etiqueta: 'Nombre' },
    { clave: 'especie_nombre', etiqueta: 'Especie' },
    { clave: 'cliente_nombre', etiqueta: 'Dueno' },
    { clave: 'sexo', etiqueta: 'Sexo' },
    { clave: 'esterilizado', etiqueta: 'Esterilizado', tipo: 'booleano' },
  ];

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

  nuevaMascota(): void { this.nav.irANuevo(); }
  editarMascota(fila: Mascota): void { this.nav.irAEditar(fila.id!); }

  eliminarMascota(fila: Mascota): void {
    if (!confirm('Seguro que deseas eliminar esta mascota?')) return;
    this.mascotaService.eliminar(fila.id!).subscribe({
      next: () => this.mascotas.set(this.mascotas().filter(m => m.id !== fila.id)),
      error: (err) => { alert('Error al eliminar.'); console.error(err); }
    });
  }
}
