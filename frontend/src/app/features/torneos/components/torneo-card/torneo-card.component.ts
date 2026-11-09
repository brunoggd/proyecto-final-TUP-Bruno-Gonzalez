import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Torneo } from '../../../../core/interfaces/torneo.interface';

@Component({
  selector: 'app-torneo-card',
  templateUrl: './torneo-card.component.html',
  styleUrl: './torneo-card.component.css'
})
export class TorneoCardComponent {
  @Input() torneo!: Torneo;

  @ViewChild('button') button!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit() {
    this.button.nativeElement.addEventListener('click', () => {
      console.log('El botón funciona ✅');
    });
  }
}
