import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CampoEditado, CampoTorneoEditable } from '../../../../core/interfaces/campo-editado.interface';
import { NombreCategoria } from '../../../../core/interfaces/nombre-categoria.interface';
import { Categoria } from '../../../../core/interfaces/categoria.interface';

@Component({
  selector: 'app-torneo-editor-campo',
  templateUrl: './torneo-editor-campo.component.html',
  styleUrl: './torneo-editor-campo.component.css'
})
export class TorneoEditorCampoComponent {
  @Input() label!: string;
  @Input() value!: string | number;
  @Input() nombreCampo!: CampoTorneoEditable;
  @Input() categorias!: Categoria[];
  @Input() editable = true;

  @Output() confirmar = new EventEmitter<CampoEditado>();

  edit: boolean = false;

  get nombreCategoria(): string {
    const idCategoria = Number(this.value);

    return this.categorias.find(c => c.id_categoria === idCategoria)?.nombre ?? '';
  }

  toggle(): void {
    this.edit = !this.edit;
  }

  confirm(): void {
    this.toggle();

    const campoEditado: CampoEditado = {
      campo: this.nombreCampo,
      valor: this.value
    };

    console.log('CAMPO EDITADO:', campoEditado);

    this.confirmar.emit(campoEditado);
  }
}
