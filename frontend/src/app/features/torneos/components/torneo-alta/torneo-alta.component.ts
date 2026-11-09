import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Torneo } from '../../../../core/interfaces/torneo.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { NombreCategoria } from '../../../../core/interfaces/nombre-categoria.interface';
import { TorneoAlta } from '../../../../core/interfaces/torneo-alta.interface';

@Component({
  selector: 'app-torneo-alta',
  templateUrl: './torneo-alta.component.html',
  styleUrl: './torneo-alta.component.css'
})
export class TorneoAltaComponent implements OnInit {
  @Output() crear = new EventEmitter<TorneoAlta>();
  @Output() salir = new EventEmitter<void>();

  private categoriasService = inject(CategoriaService);
  categorias: NombreCategoria[] = [];

  private fb = inject(FormBuilder);

  torneoForm = this.fb.group({
    nombre: ['',[Validators.required,Validators.minLength(3)]],
    ubicacion: ['',[Validators.required]],
    jugadores: [16,[Validators.required,Validators.min(2)]],
    montoPremio: [0,[Validators.required,Validators.min(0)]],
    categoria: ['', [Validators.required]],
    fechaInicio: ['',Validators.required],
    fechaFin: ['',Validators.required]
  });

  ngOnInit(): void {
    this.categoriasService.getNames().subscribe({
      next: (d) => {
        this.categorias = d;
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  crearTorneo(): void {
    if (this.torneoForm.invalid) {
      this.torneoForm.markAllAsTouched();
      return;
    }

    if (
      this.torneoForm.value.fechaInicio &&
      this.torneoForm.value.fechaFin &&
      this.torneoForm.value.fechaFin <
      this.torneoForm.value.fechaInicio
    ) {
      alert('La fecha fin no puede ser menor a la fecha de inicio');
      return;
    }

    const torneo: TorneoAlta = this.torneoForm.getRawValue() as TorneoAlta;
    this.crear.emit(torneo);
    console.log(torneo);

    this.torneoForm.reset({
      jugadores: 16,
      montoPremio: 0
    });

  }

  get f() {
    return this.torneoForm.controls;
  }

  salirDelMenuAlta(): void {
    this.salir.emit();
  }
}
