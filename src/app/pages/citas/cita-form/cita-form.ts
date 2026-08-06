import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CitaService, Cita } from '../../../services/cita';
import { MascotaService, Mascota } from '../../../services/mascota';
import { NavegacionService } from '../../../services/navegacion';
import { Boton } from '../../../shared/boton/boton';
import { environment } from '../../../../environments/environment';

interface Veterinario { id: number; nombre: string; apellido: string; }
interface Servicio { id: number; nombre: string; }

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Boton],
  templateUrl: './cita-form.html',
  styleUrl: './cita-form.css'
})
export class CitaForm implements OnInit {
  esEdicion = signal<boolean>(false);
  citaId: number | null = null;
  cargando = signal<boolean>(false);
  error = signal<string>('');

  mascotas = signal<Mascota[]>([]);
  veterinarios = signal<Veterinario[]>([]);
  servicios = signal<Servicio[]>([]);

  mascotaId = signal<number | null>(null);
  veterinarioId = signal<number | null>(null);
  servicioId = signal<number | null>(null);
  fechaHora = signal<string>('');
  estado = signal<string>('agendada');
  motivo = signal<string>('');
  costo = signal<number>(0);

  constructor(
    private citaService: CitaService,
    private mascotaService: MascotaService,
    private http: HttpClient,
    public nav: NavegacionService
  ) {}

  ngOnInit(): void {
    this.mascotaService.listar().subscribe({ next: (d) => this.mascotas.set(d) });
    this.http.get<Veterinario[]>(`${environment.apiUrl}/veterinarios/`).subscribe({ next: (d) => this.veterinarios.set(d), error: () => {} });
    this.http.get<Servicio[]>(`${environment.apiUrl}/servicios/`).subscribe({ next: (d) => this.servicios.set(d), error: () => {} });

    const id = this.nav.idSeleccionado();
    if (id) {
      this.esEdicion.set(true);
      this.citaId = id;
      this.cargarCita(id);
    }
  }

  cargarCita(id: number): void {
    this.cargando.set(true);
    this.citaService.obtener(id).subscribe({
      next: (data) => {
        this.mascotaId.set(data.mascota);
        this.veterinarioId.set(data.veterinario);
        this.servicioId.set(data.servicio);
        this.fechaHora.set(data.fecha_hora ? data.fecha_hora.substring(0, 16) : '');
        this.estado.set(data.estado ?? 'agendada');
        this.motivo.set(data.motivo ?? '');
        this.costo.set(data.costo ?? 0);
        this.cargando.set(false);
      },
      error: (err) => { this.error.set('No se pudo cargar la cita.'); this.cargando.set(false); console.error(err); }
    });
  }

  guardar(): void {
    if (!this.mascotaId() || !this.veterinarioId() || !this.servicioId()) {
      this.error.set('Selecciona mascota, veterinario y servicio.');
      return;
    }

    const cita: Cita = {
      mascota: this.mascotaId()!,
      veterinario: this.veterinarioId()!,
      servicio: this.servicioId()!,
      fecha_hora: this.fechaHora(),
      estado: this.estado(),
      motivo: this.motivo(),
      costo: this.costo()
    };

    this.cargando.set(true);
    const peticion = this.esEdicion()
      ? this.citaService.actualizar(this.citaId!, cita)
      : this.citaService.crear(cita);

    peticion.subscribe({
      next: () => this.nav.volverALista(),
      error: (err) => { this.error.set('Error al guardar la cita.'); this.cargando.set(false); console.error(err); }
    });
  }

  cancelar(): void {
    this.nav.volverALista();
  }
}
