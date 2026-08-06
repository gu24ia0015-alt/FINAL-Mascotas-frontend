import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Cita {
  id?: number;
  mascota: number;
  veterinario: number;
  servicio: number;
  fecha_hora: string;
  estado?: string;
  motivo?: string;
  notas?: string;
  costo?: number;
  mascota_nombre?: string;
  veterinario_nombre?: string;
  servicio_nombre?: string;
}

@Injectable({ providedIn: 'root' })
export class CitaService {
  private apiUrl = `${environment.apiUrl}/citas/`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  obtener(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}${id}/`);
  }

  crear(cita: Cita): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, cita);
  }

  actualizar(id: number, cita: Cita): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}${id}/`, cita);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
