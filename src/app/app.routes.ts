import { Routes } from '@angular/router';
import { ClienteList } from './pages/clientes/cliente-list/cliente-list';
import { ClienteForm } from './pages/clientes/cliente-form/cliente-form';
import { MascotaList } from './pages/mascotas/mascota-list/mascota-list';
import { MascotaForm } from './pages/mascotas/mascota-form/mascota-form';

export const routes: Routes = [
  { path: 'clientes', component: ClienteList },
  { path: 'clientes/nuevo', component: ClienteForm },
  { path: 'clientes/editar/:id', component: ClienteForm },
  { path: 'mascotas', component: MascotaList },
  { path: 'mascotas/nuevo', component: MascotaForm },
  { path: 'mascotas/editar/:id', component: MascotaForm },
  { path: '', redirectTo: 'clientes', pathMatch: 'full' }
];
