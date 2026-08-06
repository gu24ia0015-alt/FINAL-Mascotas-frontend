import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Mascota {
  id?: number;
  cliente: number;
  especie: number;
  raza?: number | null;
  nombre: string;
  fecha_nacimiento?: string;
  peso?: number;
  color?: string;
  sexo: string;
  esterilizado?: boolean;
  foto_url?: string;
  notas?: string;
  especie_nombre?: string;
  cliente_nombre?: string;
}

@Injectable({ providedIn: 'root' })
export class MascotaService {
  private apiUrl = `${environment.apiUrl}/mascotas/`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.apiUrl);
  }

  obtener(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.apiUrl}${id}/`);
  }

  crear(mascota: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(this.apiUrl, mascota);
  }

  actualizar(id: number, mascota: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.apiUrl}${id}/`, mascota);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
