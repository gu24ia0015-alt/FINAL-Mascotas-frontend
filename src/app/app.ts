import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './shared/navbar/navbar';
import { NavegacionService } from './services/navegacion';
import { ClienteList } from './pages/clientes/cliente-list/cliente-list';
import { ClienteForm } from './pages/clientes/cliente-form/cliente-form';
import { MascotaList } from './pages/mascotas/mascota-list/mascota-list';
import { MascotaForm } from './pages/mascotas/mascota-form/mascota-form';
import { ProductoList } from './pages/productos/producto-list/producto-list';
import { ProductoForm } from './pages/productos/producto-form/producto-form';
import { PedidoList } from './pages/pedidos/pedido-list/pedido-list';
import { PedidoForm } from './pages/pedidos/pedido-form/pedido-form';
import { CitaList } from './pages/citas/cita-list/cita-list';
import { CitaForm } from './pages/citas/cita-form/cita-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, Navbar,
    ClienteList, ClienteForm,
    MascotaList, MascotaForm,
    ProductoList, ProductoForm,
    PedidoList, PedidoForm,
    CitaList, CitaForm
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public nav: NavegacionService) {}
}
