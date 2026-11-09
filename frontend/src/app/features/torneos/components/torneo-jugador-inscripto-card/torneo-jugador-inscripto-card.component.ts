import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JugadorInscripto } from '../../../../core/interfaces/jugador-inscripto';

@Component({
  selector: 'app-torneo-jugador-inscripto-card',
  templateUrl: './torneo-jugador-inscripto-card.component.html',
  styleUrl: './torneo-jugador-inscripto-card.component.css'
})
export class TorneoJugadorInscriptoCardComponent {
  @Input() jugador!: JugadorInscripto;

  @Output() eliminarJugador = new EventEmitter<number>();

  eliminar(): void {
    console.log(`ID INSCRIPCION DEL JUGADOR ${this.jugador.nombre} ${this.jugador.apellido}: ${this.jugador.id_inscripcion}`);
    
    this.eliminarJugador.emit(this.jugador.id_inscripcion);
  }
}
