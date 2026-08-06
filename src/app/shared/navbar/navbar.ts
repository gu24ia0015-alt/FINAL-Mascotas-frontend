import { Component } from '@angular/core';
import { NavegacionService } from '../../services/navegacion';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(public nav: NavegacionService) {}
}
