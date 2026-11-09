import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SetPartido } from '../../../core/interfaces/set-partido.interface';

@Component({
  selector: 'app-partido-editor',
  templateUrl: './partido-editor.component.html',
  styleUrl: './partido-editor.component.css'
})
export class PartidoEditorComponent implements OnChanges {
  @Input() partidoSeleccionado!: SetPartido[];

  @Output() guardar = new EventEmitter<SetPartido[]>();

  @Output() agregar = new EventEmitter<void>();

  @Output() eliminar = new EventEmitter<number>();

  ngOnChanges(changes: SimpleChanges): void {
    if ( changes['partidoSeleccionado'] ) {
      console.log('SETS ACTUALIZADOS:', this.partidoSeleccionado);
    }
  }

  guardarResultado(): void {
    console.log('RESULTADO:', this.partidoSeleccionado);

    this.guardar.emit(this.partidoSeleccionado);
  }

  agregarSet(): void {
    this.agregar.emit();
  }

  eliminarSet(idSet: number): void {
    this.eliminar.emit(idSet);
  }
}
