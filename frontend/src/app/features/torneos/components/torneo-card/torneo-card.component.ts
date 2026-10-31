import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-torneo-card',
  templateUrl: './torneo-card.component.html',
  styleUrl: './torneo-card.component.css'
})
export class TorneoCardComponent {
  @Input() tournament_name!: string;
  @Input() tournament_date!: string;
  @Input() tournament_place!: string;
  @Input() thereIsAPrize!: boolean;
  @Input() tournament_prize!: number;

  @ViewChild('button') button!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit() {
    this.button.nativeElement.addEventListener('click', () => {
      console.log('El botón funciona ✅');
    });
  }
}
