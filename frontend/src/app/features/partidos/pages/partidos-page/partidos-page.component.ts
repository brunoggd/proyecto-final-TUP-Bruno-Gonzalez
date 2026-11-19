import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PartidoDTO } from '../../../../core/interfaces/partido-dto.interface';
import { PartidoService } from '../../../../core/services/partido.service';
import { SetPartido } from '../../../../core/interfaces/set-partido.interface';
import { TorneoService } from '../../../../core/services/torneo.service';

@Component({
  selector: 'app-partidos-page',
  templateUrl: './partidos-page.component.html',
  styleUrl: './partidos-page.component.css'
})
export class PartidosPageComponent {
  @Input() partidos!: PartidoDTO[];
  @Input() fechaInicioTorneo!: string;
  @Input() fechaFinTorneo!: string;
  @Input() idTorneo!: number;

  @Output() partidosActualizados = new EventEmitter<PartidoDTO[]>();

  partidoSeleccionado: PartidoDTO | null = null;
  setsSeleccionados: SetPartido[] = [];
  idPartidoSeleccionado!: number;

  private partidosService = inject(PartidoService);

  private torneosService = inject(TorneoService);

  private recargarPartidos(): void {
    this.torneosService.getMatches(this.idTorneo).subscribe({
      next: (partidos) => {
        this.partidos = partidos;
        this.partidosActualizados.emit(partidos);

        if (this.partidoSeleccionado) {
          this.partidoSeleccionado = partidos.find(p => p.id_partido === this.partidoSeleccionado?.id_partido) ?? null;
        }
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  buscarPartido(id: number): void {
    this.idPartidoSeleccionado = id;
    this.partidoSeleccionado = this.partidos.find(p => p.id_partido === id) ?? null;

    this.partidosService.getSetsByMatch(id).subscribe({
      next: (sets) => this.setsSeleccionados = sets,
      error: (e) => {
        console.error(e);
      }
    });
  }

  guardarResultado(sets: SetPartido[]): void {
    const id = this.idPartidoSeleccionado;

    this.partidosService.updateSets(id, sets).subscribe({
      next: () => {
        this.recargarPartidos();
        this.partidosService.notificar(id);

      },
      error: (e) => {
        alert(e.error?.error ?? 'No se pudo actualizar el partido');
      }
    });
  }

  guardarHorario(horario: { fecha: string; hora: string }): void {
    const id = this.idPartidoSeleccionado;

    this.partidosService.updateSchedule(id, horario).subscribe({
      next: () => {
        this.partidos = this.partidos.map(p => p.id_partido === id ? { ...p, ...horario } : p);

        if (this.partidoSeleccionado) {
          this.partidoSeleccionado = {
            ...this.partidoSeleccionado,
            ...horario
          };
        }
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
        alert(e.error?.error ?? 'No se pudo actualizar el partido');
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
        alert(e.error?.error ?? 'No se pudo actualizar el partido');
      }
    });
  }

  get numerosRonda(): number[] {
    // Convierte la lista de partidos en una lista de números de ronda.
    const numeros = this.partidos.map(partido => partido.numero_ronda);

    // Set elimina los números repetidos.
    const rondasSinRepetir = new Set(numeros);

    // Convertimos el Set de vuelta a un array y ordenamos las rondas.
    return Array.from(rondasSinRepetir).sort((a, b) => a - b);
  }

  partidosDeRonda(numero: number): PartidoDTO[] {
    // Devuelve solo los partidos cuyo número de ronda coincide con el recibido.
    return this.partidos.filter(partido => partido.numero_ronda === numero);
  }

  get campeonDelTorneo(): string | null {
    if (!this.partidos?.length) return null;

    const ultimaRonda = Math.max(...this.partidos.map(partido => partido.numero_ronda));

    const finales = this.partidos.filter(
      partido => partido.numero_ronda === ultimaRonda
    );

    // Si hay más de un partido, todavía no llegamos a la final.
    if (finales.length !== 1 || finales[0].ganador === null) return null;

    const final = finales[0];

    if (final.ganador === final.id_jugador1) {
      return `${final.nombre_jugador1} ${final.apellido_jugador1}`;
    }

    if (final.ganador === final.id_jugador2) {
      return `${final.nombre_jugador2} ${final.apellido_jugador2}`;
    }

    return null;
  }
}
