import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Torneo } from '../../../../core/interfaces/torneo.interface';

@Component({
  selector: 'app-torneo-card-small',
  templateUrl: './torneo-card-small.component.html',
  styleUrl: './torneo-card-small.component.css'
})
export class TorneoCardSmallComponent {
  @Input({required: true}) torneo!: Torneo;
  @Input() seleccionado!: boolean;

  @Output() torneoSeleccionado = new EventEmitter<Torneo>();
  @Output() eliminar = new EventEmitter<number>();

  seleccionar() {
    this.torneoSeleccionado.emit(this.torneo);
  }

  eliminarTorneo(): void {
    this.eliminar.emit(this.torneo.id_torneo);
  }
}
