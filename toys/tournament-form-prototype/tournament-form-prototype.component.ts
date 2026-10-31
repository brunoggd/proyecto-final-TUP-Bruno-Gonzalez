import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tournament-form-prototype',
  templateUrl: './tournament-form-prototype.component.html',
  styleUrl: './tournament-form-prototype.component.css'
})
export class TournamentFormPrototypeComponent {
  tournament_group: FormGroup;
  tournament_name: FormControl;
  tournament_category: FormControl;
  tournament_participants: FormControl;

  tournament_prize: FormControl;
  tournament_prizeAmount: FormControl;

  tournament_startDate: FormControl;
  tournament_endDate: FormControl;

  thereIsAPrize: boolean;

  @ViewChild('checkbox') checkbox!: ElementRef<HTMLInputElement>;

  constructor() {
    this.tournament_name = new FormControl('', Validators.required);
    this.tournament_category = new FormControl('', Validators.required);
    this.tournament_participants = new FormControl('', Validators.required);

    this.tournament_prize = new FormControl(false);
    this.tournament_prizeAmount = new FormControl('');

    this.tournament_startDate = new FormControl('', Validators.required);
    this.tournament_endDate = new FormControl('', Validators.required);

    this.tournament_group = new FormGroup({
      name: this.tournament_name,
      category: this.tournament_category,
      participants: this.tournament_participants,
      prize: this.tournament_prize,
      prizeAmount: this.tournament_prizeAmount,
      startDate: this.tournament_startDate,
      endDate: this.tournament_endDate
    });

    this.thereIsAPrize = false;
  }

  ngAfterViewInit() {
    this.checkbox.nativeElement.addEventListener('click', () => {
      this.thereIsAPrize = !this.thereIsAPrize;
    });
  }

  handleSubmit() {
    console.log(this.tournament_group.value)
  }
}
