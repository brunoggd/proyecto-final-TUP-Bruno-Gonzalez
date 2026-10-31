import { Component, inject, OnInit } from '@angular/core';
import { Torneo } from '../../../../core/interfaces/torneo.interface';
import { TorneoService } from '../../../../core/services/torneo.service';
import { Categoria } from '../../../../core/interfaces/categoria.interface';
import { CategoriaService } from '../../../../core/services/categoria.service';

@Component({
  selector: 'app-torneos-page',
  templateUrl: './torneos-page.component.html',
  styleUrl: './torneos-page.component.css'
})
export class TorneosPageComponent implements OnInit {
  torneos: Torneo[] = [];
  categorias: Categoria[] = [];
  private torneosService = inject(TorneoService);
  private categoriasService = inject(CategoriaService);

  torneoSeleccionado!: Torneo;

  ngOnInit(): void {
    this.torneosService.getAll().subscribe({
      next: (data) => {
        this.torneos = data;
        console.log(this.torneos);
      },
      error: (e) => {
        console.error(e);
      }
    });

    this.categoriasService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        console.log(this.categorias);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  obtenerTorneoPorId(id: number) {
    this.torneosService.getById(id).subscribe({
      next: (data) => {
        this.torneoSeleccionado = data;
        console.log(this.torneoSeleccionado);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }
}
