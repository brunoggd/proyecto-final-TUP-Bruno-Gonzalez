import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
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

  @Input() categorias!: NombreCategoria[];
  @Input() categoriaActual!: Categoria;
  
  @Output() categoriaModificada = new EventEmitter<Categoria>();

  torneoEditado!: Torneo;

  @Output() torneoModificado = new EventEmitter<Torneo>();
  @Output() inscripcionEliminada = new EventEmitter<number>();

  @Output() volver = new EventEmitter<boolean>();

  menu: number = 0;

  ngOnInit(): void {
    this.torneoEditado = { ...this.torneo };
  }

  ngOnChanges(): void {
    // console.log('TORNEO NUEVO', this.torneo);

    this.torneoEditado = {
      ...this.torneo
    };

    // console.log('Categoría actual:', this.categoriaActual);
  }

  modificarTorneo(e: CampoEditado): void {
    if (e.campo === 'categoria') {
      this.categoriaActual.nombre = String(e.valor);

      // console.log('CATEGORIA MODIFICADA:', this.categoriaActual);
      this.categoriaModificada.emit(this.categoriaActual);
      return;
    }

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
}
