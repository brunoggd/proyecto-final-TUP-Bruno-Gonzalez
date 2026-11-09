import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CampoEditado } from '../../../../core/interfaces/campo-editado.interface';
import { Torneo } from '../../../../core/interfaces/torneo.interface';

@Component({
  selector: 'app-torneo-editor-campo',
  templateUrl: './torneo-editor-campo.component.html',
  styleUrl: './torneo-editor-campo.component.css'
})
export class TorneoEditorCampoComponent {
  @Input() label!: string;
  @Input() value!: string | number;
  @Input() nombreCampo!: keyof Torneo;

  @Output() confirmar = new EventEmitter<CampoEditado>();

  edit: boolean = false;

  toggle(): void {
    this.edit = !this.edit;
  }

  confirm(): void {
    this.toggle();

    const campoEditado: CampoEditado = {
      campo: this.nombreCampo,
      valor: this.value
    };

    this.confirmar.emit(campoEditado);
  }
}
