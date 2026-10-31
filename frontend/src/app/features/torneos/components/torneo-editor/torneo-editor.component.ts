import { Component, Input } from '@angular/core';
import { Torneo } from '../../../../core/interfaces/torneo.interface';

@Component({
  selector: 'app-torneo-editor',
  templateUrl: './torneo-editor.component.html',
  styleUrl: './torneo-editor.component.css'
})
export class TorneoEditorComponent {
  @Input() torneo!: Torneo;
}
