import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-usuario-card',
  templateUrl: './usuario-card.component.html',
  styleUrl: './usuario-card.component.css'
})
export class UsuarioCardComponent implements OnInit {
  authService = inject(AuthService);

  rol_title: string = '';

  ngOnInit(): void {
    this.rol_title = 'rol-' + this.authService.rol + '-title';
  }
}
