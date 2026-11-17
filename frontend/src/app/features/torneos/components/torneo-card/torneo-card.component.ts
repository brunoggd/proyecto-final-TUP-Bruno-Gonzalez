import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { Torneo } from '../../../../core/interfaces/torneo.interface';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-torneo-card',
  templateUrl: './torneo-card.component.html',
  styleUrl: './torneo-card.component.css'
})
export class TorneoCardComponent {
  @Input() torneo!: Torneo;
  @Input() esMiTorneo!: boolean;

  @Output() torneoSeleccionado = new EventEmitter<Torneo>();
  @Output() eliminar = new EventEmitter<number>();
  @Output() anotarse = new EventEmitter<number>();

  private authService = inject(AuthService);

  soyJugador(): boolean {
    return this.authService.esJugador();
  }

  soyOrganizador(): boolean {
    return this.authService.esOrganizador();
  }

  seleccionar() {
    this.torneoSeleccionado.emit(this.torneo);
  }

  eliminarTorneo(): void {
    this.eliminar.emit(this.torneo.id_torneo);
  }

  anotarseAlTorneo(): void {
    this.anotarse.emit(this.torneo.id_torneo);
  }
}
