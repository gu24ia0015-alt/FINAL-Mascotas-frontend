import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DetallePedido {
  id?: number;
  producto: number;
  producto_nombre?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Pedido {
  id?: number;
  cliente: number;
  direccion: number;
  cupon?: number | null;
  estado?: string;
  subtotal: number;
  descuento?: number;
  impuestos?: number;
  total: number;
  metodo_pago?: string;
  fecha_entrega_estimada?: string;
  notas?: string;
  cliente_nombre?: string;
  detalles?: DetallePedido[];
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = `${environment.apiUrl}/pedidos/`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.apiUrl);
  }

  obtener(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}${id}/`);
  }

  crear(pedido: Pedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.apiUrl, pedido);
  }

  actualizar(id: number, pedido: Pedido): Observable<Pedido> {
    return this.http.put<Pedido>(`${this.apiUrl}${id}/`, pedido);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
