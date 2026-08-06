import { Routes } from '@angular/router';
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

export const routes: Routes = [
  { path: 'clientes', component: ClienteList },
  { path: 'clientes/nuevo', component: ClienteForm },
  { path: 'clientes/editar/:id', component: ClienteForm },
  { path: 'mascotas', component: MascotaList },
  { path: 'mascotas/nuevo', component: MascotaForm },
  { path: 'mascotas/editar/:id', component: MascotaForm },
  { path: 'productos', component: ProductoList },
  { path: 'productos/nuevo', component: ProductoForm },
  { path: 'productos/editar/:id', component: ProductoForm },
  { path: 'pedidos', component: PedidoList },
  { path: 'pedidos/nuevo', component: PedidoForm },
  { path: 'pedidos/editar/:id', component: PedidoForm },
  { path: 'citas', component: CitaList },
  { path: 'citas/nuevo', component: CitaForm },
  { path: 'citas/editar/:id', component: CitaForm },
  { path: '', redirectTo: 'clientes', pathMatch: 'full' }
];
