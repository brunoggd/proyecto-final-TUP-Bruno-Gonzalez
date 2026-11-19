import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SetPartido } from '../../../../core/interfaces/set-partido.interface';
import { PartidoDTO } from '../../../../core/interfaces/partido-dto.interface';

@Component({
  selector: 'app-partido-editor',
  templateUrl: './partido-editor.component.html',
  styleUrl: './partido-editor.component.css'
})
export class PartidoEditorComponent implements OnChanges {
  @Input() partido!: PartidoDTO;
  @Input() sets: SetPartido[] = [];

  @Input() fechaMinima!: string;
  @Input() fechaMaxima!: string;

  @Output() guardar = new EventEmitter<SetPartido[]>();
  @Output() agregar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<number>();
  @Output() guardarHorario = new EventEmitter<{ fecha: string; hora: string }>();

  fecha: string = '';
  hora: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sets']) {
      console.log('SETS ACTUALIZADOS:', this.sets);
    }

    if (changes['partido'] && this.partido) {
      this.fecha = this.partido.fecha.slice(0, 10);
      this.hora = this.partido.hora.slice(0, 5);
    }
  }

  guardarResultado(): void {
    this.guardar.emit(this.sets);
  }

  guardarHorarioPartido(): void {
    if (!this.fecha || !this.hora) return;

    this.guardarHorario.emit({
      fecha: this.fecha,
      hora: this.hora
    });
  }

  agregarSet(): void {
    this.agregar.emit();
  }

  eliminarSet(idSet: number): void {
    this.eliminar.emit(idSet);
  }
}
