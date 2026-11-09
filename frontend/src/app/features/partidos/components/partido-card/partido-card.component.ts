import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { PartidoDTO } from '../../../../core/interfaces/partido-dto.interface';
import { SetPartido } from '../../../../core/interfaces/set-partido.interface';
import { PartidoService } from '../../../../core/services/partido.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-partido-card',
  templateUrl: './partido-card.component.html',
  styleUrl: './partido-card.component.css'
})
export class PartidoCardComponent implements OnInit {
  @Input() partido!: PartidoDTO;

  @Output() seleccionar = new EventEmitter<number>();

  sets: SetPartido[] = [];

  private partidosService = inject(PartidoService);
  private partidosSub!: Subscription;

  cargarSets(): void {
    this.partidosService.getSetsByMatch(this.partido.id_partido).subscribe({
      next: (d) => {
        this.sets = d;
        console.log(this.sets);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  ngOnInit(): void {
    this.cargarSets();

    this.partidosSub = this.partidosService.actualizacion$.subscribe(id => {
      if (id === this.partido.id_partido) {
        this.cargarSets();
      }
    });
  }

  seleccionarPartido(id: number): void {
    this.seleccionar.emit(id);
  }

  ngOnDestroy(): void {
    this.partidosSub.unsubscribe();
  }
}
