import { Routes } from '@angular/router';
import { ClienteList } from './pages/clientes/cliente-list/cliente-list';

export const routes: Routes = [
  { path: 'clientes', component: ClienteList },
  { path: '', redirectTo: 'clientes', pathMatch: 'full' }
];
