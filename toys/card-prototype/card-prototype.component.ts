import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-card-prototype',
  templateUrl: './card-prototype.component.html',
  styleUrl: './card-prototype.component.css'
})
export class CardPrototypeComponent {
  public readonly tournament_name: string = 'Torneo Intermedia';
  public readonly tournament_date: string = '26-08-09';
  public readonly tournament_place: string = 'Los Andes, Alcorta';
  public readonly tournament_prize: string = '$15000';

  thereIsAPrize: boolean = true;

  @ViewChild('button') button!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit() {
    this.button.nativeElement.addEventListener('click', () => {
      console.log('El botón funciona ✅');
    });
  }
}
