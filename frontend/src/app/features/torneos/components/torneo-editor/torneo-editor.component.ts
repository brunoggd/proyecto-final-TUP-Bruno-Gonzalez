import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Torneo } from '../../../../core/interfaces/torneo.interface';
import { CampoEditado } from '../../../../core/interfaces/campo-editado.interface';
import { JugadorInscripto } from '../../../../core/interfaces/jugador-inscripto';
import { PartidoDTO } from '../../../../core/interfaces/partido-dto.interface';
import { NombreCategoria } from '../../../../core/interfaces/nombre-categoria.interface';
import { Categoria } from '../../../../core/interfaces/categoria.interface';

@Component({
  selector: 'app-torneo-editor',
  templateUrl: './torneo-editor.component.html',
  styleUrl: './torneo-editor.component.css'
})
export class TorneoEditorComponent implements OnInit, OnChanges {
  @Input() torneo!: Torneo;
  @Input() jugadoresInscriptos!: JugadorInscripto[];
  @Input() partidos!: PartidoDTO[];

  @Input() categorias!: Categoria[];

  torneoEditado!: Torneo;

  @Output() torneoModificado = new EventEmitter<Torneo>();
  @Output() inscripcionEliminada = new EventEmitter<number>();
  @Output() iniciarSorteo = new EventEmitter<number>();

  @Output() partidosActualizados = new EventEmitter<PartidoDTO[]>();

  @Output() volver = new EventEmitter<boolean>();

  menu: number = 0;

  ngOnInit(): void {
    this.torneoEditado = { ...this.torneo };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['torneo'] && this.torneo) {
      this.torneoEditado = { ...this.torneo };
    }
  }

  modificarTorneo(e: CampoEditado): void {
    this.torneoEditado = {
      ...this.torneoEditado,
      [e.campo]: e.valor
    };

    // console.log('TORNEO EDITADO:', this.torneoEditado);

    this.torneoModificado.emit(this.torneoEditado);
  }

  eliminarInscripcion(id_inscripcion: number): void {
    this.inscripcionEliminada.emit(id_inscripcion);
  }

  toggleMenuPartidos(): void {
    this.menu = 1;
  }

  toggleMenuTorneo(): void {
    this.menu = 0;
  }

  volverAlMostradorDePartidos(): void {
    this.volver.emit(false);
  }

  emitirSolicitudSorteo(): void {
    this.iniciarSorteo.emit(this.torneo.id_torneo);
  }

  actualizarPartidos(partidos: PartidoDTO[]): void {
    this.partidosActualizados.emit(partidos);
  }
}
