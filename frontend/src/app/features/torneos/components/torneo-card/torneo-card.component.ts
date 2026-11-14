import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Torneo } from '../../../../core/interfaces/torneo.interface';

@Component({
  selector: 'app-torneo-card',
  templateUrl: './torneo-card.component.html',
  styleUrl: './torneo-card.component.css'
})
export class TorneoCardComponent {
  @Input() torneo!: Torneo;

  @ViewChild('deleteTournamentButton') deleteTournamentButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('signTournamentButton') signTournamentButton!: ElementRef<HTMLButtonElement>;

  @Output() torneoSeleccionado = new EventEmitter<number>();
  @Output() eliminar = new EventEmitter<number>();

  seleccionar() {
    this.torneoSeleccionado.emit(this.torneo.id_torneo);
  }

  eliminarTorneo(): void {
    this.eliminar.emit(this.torneo.id_torneo);
  }

  ngAfterViewInit() {
    this.deleteTournamentButton.nativeElement.addEventListener('click', () => {
      console.log('El botón de eliminar torneos funciona ✅');
    });

    this.signTournamentButton.nativeElement.addEventListener('click', () => {
      console.log('El botón para anotarse a torneos funciona ✅');
    });
  }
}
