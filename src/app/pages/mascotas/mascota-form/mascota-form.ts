import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MascotaService, Mascota } from '../../../services/mascota';
import { ClienteService, Cliente } from '../../../services/cliente';
import { NavegacionService } from '../../../services/navegacion';
import { Boton } from '../../../shared/boton/boton';
import { CampoInput } from '../../../shared/input/input';
import { environment } from '../../../../environments/environment';

interface Especie { id: number; nombre: string; }

@Component({
  selector: 'app-mascota-form',
  standalone: true,
  imports: [CommonModule, FormsModule, Boton, CampoInput],
  templateUrl: './mascota-form.html',
  styleUrl: './mascota-form.css'
})
export class MascotaForm implements OnInit {
  esEdicion = signal<boolean>(false);
  mascotaId: number | null = null;
  cargando = signal<boolean>(false);
  error = signal<string>('');

  clientes = signal<Cliente[]>([]);
  especies = signal<Especie[]>([]);

  nombre = signal<string>('');
  clienteId = signal<number | null>(null);
  especieId = signal<number | null>(null);
  fecha_nacimiento = signal<string>('');
  peso = signal<number>(0);
  color = signal<string>('');
  sexo = signal<string>('M');
  esterilizado = signal<boolean>(false);
  notas = signal<string>('');

  constructor(
    private mascotaService: MascotaService,
    private clienteService: ClienteService,
    private http: HttpClient,
    public nav: NavegacionService
  ) {}

  ngOnInit(): void {
    this.clienteService.listar().subscribe({ next: (data) => this.clientes.set(data) });
    this.http.get<Especie[]>(`${environment.apiUrl}/especies/`).subscribe({ next: (data) => this.especies.set(data), error: () => {} });

    const id = this.nav.idSeleccionado();
    if (id) {
      this.esEdicion.set(true);
      this.mascotaId = id;
      this.cargarMascota(id);
    }
  }

  cargarMascota(id: number): void {
    this.cargando.set(true);
    this.mascotaService.obtener(id).subscribe({
      next: (data) => {
        this.nombre.set(data.nombre);
        this.clienteId.set(data.cliente);
        this.especieId.set(data.especie);
        this.fecha_nacimiento.set(data.fecha_nacimiento ?? '');
        this.peso.set(data.peso ?? 0);
        this.color.set(data.color ?? '');
        this.sexo.set(data.sexo);
        this.esterilizado.set(data.esterilizado ?? false);
        this.notas.set(data.notas ?? '');
        this.cargando.set(false);
      },
      error: (err) => { this.error.set('No se pudo cargar la mascota.'); this.cargando.set(false); console.error(err); }
    });
  }

  guardar(): void {
    if (!this.clienteId() || !this.especieId()) {
      this.error.set('Selecciona un cliente y una especie.');
      return;
    }

    const mascota: Mascota = {
      nombre: this.nombre(),
      cliente: this.clienteId()!,
      especie: this.especieId()!,
      fecha_nacimiento: this.fecha_nacimiento(),
      peso: this.peso(),
      color: this.color(),
      sexo: this.sexo(),
      esterilizado: this.esterilizado(),
      notas: this.notas()
    };

    this.cargando.set(true);
    const peticion = this.esEdicion()
      ? this.mascotaService.actualizar(this.mascotaId!, mascota)
      : this.mascotaService.crear(mascota);

    peticion.subscribe({
      next: () => this.nav.volverALista(),
      error: (err) => { this.error.set('Error al guardar la mascota.'); this.cargando.set(false); console.error(err); }
    });
  }

  cancelar(): void {
    this.nav.volverALista();
  }
}
