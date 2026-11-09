import { Component, inject, Input } from '@angular/core';
import { PartidoDTO } from '../../../../core/interfaces/partido-dto.interface';
import { PartidoService } from '../../../../core/services/partido.service';
import { SetPartido } from '../../../../core/interfaces/set-partido.interface';

@Component({
  selector: 'app-partidos-page',
  templateUrl: './partidos-page.component.html',
  styleUrl: './partidos-page.component.css'
})
export class PartidosPageComponent {
  @Input() partidos!: PartidoDTO[];

  partidoSeleccionado!: SetPartido[];
  idPartidoSeleccionado!: number;

  private partidosService = inject(PartidoService);

  buscarPartido(id: number): void {
    this.idPartidoSeleccionado = id;

    this.partidosService.getSetsByMatch(id).subscribe({
      next: (d) => {
        this.partidoSeleccionado = d;
        console.log(this.partidoSeleccionado);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  guardarResultado(sets: SetPartido[]): void {
    this.partidosService.updateSets(this.idPartidoSeleccionado, sets).subscribe({
      next: () => {
        console.log('Resultado actualizado');
        this.partidosService.notificar(this.idPartidoSeleccionado);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  refrescarPartido(): void {
    this.partidosService.notificar(this.idPartidoSeleccionado);
      this.buscarPartido(this.idPartidoSeleccionado);
  }

  agregarSet(): void {
    this.partidosService.createSet(this.idPartidoSeleccionado).subscribe({
      next: () => {
        console.log('Set agregado');

        this.refrescarPartido();
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  eliminarSet(idSet: number): void {
    this.partidosService.removeSet(idSet).subscribe({
      next: () => {
        console.log(`Set ${idSet} eliminado`);
        
        this.refrescarPartido();
      },
      error: (e) => {
        console.error(e);
      }
    });
  }
}
