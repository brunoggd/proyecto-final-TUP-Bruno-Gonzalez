import { Component, inject, OnInit } from '@angular/core';
import { Torneo } from '../../../../core/interfaces/torneo.interface';
import { TorneoService } from '../../../../core/services/torneo.service';
import { Categoria } from '../../../../core/interfaces/categoria.interface';
import { CategoriaService } from '../../../../core/services/categoria.service';
import { InscripcionService } from '../../../../core/services/inscripcion.service';
import { JugadorInscripto } from '../../../../core/interfaces/jugador-inscripto';
import { PartidoDTO } from '../../../../core/interfaces/partido-dto.interface';
import { NombreCategoria } from '../../../../core/interfaces/nombre-categoria.interface';
import { SedeTorneo } from '../../../../core/interfaces/sede-torneo.interface';
import { TorneoAlta } from '../../../../core/interfaces/torneo-alta.interface';

@Component({
  selector: 'app-torneos-page',
  templateUrl: './torneos-page.component.html',
  styleUrl: './torneos-page.component.css'
})
export class TorneosPageComponent implements OnInit {
  torneos: Torneo[] = [];
  categorias: NombreCategoria[] = [];
  sedes: SedeTorneo[] = []

  jugadoresInscriptos: JugadorInscripto[] = [];
  partidos: PartidoDTO[] = [];

  private torneosService = inject(TorneoService);
  private categoriasService = inject(CategoriaService);
  private inscripcionesService = inject(InscripcionService);

  torneoSeleccionado!: Torneo;
  categoriaTorneoSeleccionado!: Categoria;

  nombreTorneo: string = '';
  categoriaSeleccionada: string = '';
  sedeSeleccionada: string = '';

  private timeOut?: ReturnType<typeof setTimeout>;

  menu: number = 0;

  cargarTorneos(): void {
    this.torneosService.getAll().subscribe({
      next: (data) => {
        this.torneos = data;
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  ngOnInit(): void {
    this.cargarTorneos();

    this.torneosService.getSedes().subscribe({
      next: (data) => {
        this.sedes = data;
      },
      error: (e) => {
        console.error(e);
      }
    });

    this.categoriasService.getNames().subscribe({
      next: (data) => {
        this.categorias = data;
        // console.log(this.categorias);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  obtenerTorneoPorId(id: number) {
    this.torneosService.getById(id).subscribe({
      next: (data) => {
        this.torneoSeleccionado = {
          ...data,
          fechaInicio: data.fechaInicio.split('T')[0],
          fechaFin: data.fechaFin.split('T')[0]
        };
        // console.log(this.torneoSeleccionado);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  filtrar(): void {
    clearTimeout(this.timeOut);

    this.timeOut = setTimeout(() => {
      this.torneosService.filtrar(
        this.nombreTorneo,
        this.categoriaSeleccionada,
        this.sedeSeleccionada
      ).subscribe({
        next: (data) => {
          this.torneos = data;
        },
        error: (e) => {
          console.error(e);
        }
      });
    }, 500);
  }

  obtenerJugadoresInscriptos(id: number): void {
    this.torneosService.getPlayers(id).subscribe({
      next: (data) => {
        this.jugadoresInscriptos = data;
        console.log(this.jugadoresInscriptos);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  obtenerPartidosDelTorneo(id: number): void {
    this.torneosService.getMatches(id).subscribe({
      next: (data) => {
        this.partidos = data;
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  obtenerTorneo(id: number): void {
    this.obtenerTorneoPorId(id);
    this.obtenerJugadoresInscriptos(id);
    this.obtenerPartidosDelTorneo(id);
    this.obtenerCategoriaTorneoSeleccionado(id);
  }

  guardarCambios(t: Torneo): void {
    const torneoMod = {
      ...t,
      jugadores: Number(t.jugadores),
      montoPremio: Number(t.montoPremio)
    }

    this.torneosService.update(t.id_torneo, torneoMod).subscribe();
  }

  guardarNuevaCategoria(c: Categoria): void {
    const idCategoria = c.id_categoria;
    const categoriaNueva: Omit<Categoria, 'id_categoria'> = {
      nombre: c.nombre,
      id_torneo: c.id_torneo
    };
    this.categoriasService.update(idCategoria, categoriaNueva).subscribe();
  }

  eliminarInscripcion(idInscripcion: number): void {
    this.inscripcionesService.remove(idInscripcion).subscribe({
      next: () => {
        this.obtenerJugadoresInscriptos(
          this.torneoSeleccionado.id_torneo
        );
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  crearTorneo(torneo: TorneoAlta): void {
    const categoria: string = torneo.categoria;

    const torneoSinCategoria: Omit<Torneo, 'id_torneo'> = {
      nombre: torneo.nombre,
      ubicacion: torneo.ubicacion,
      jugadores: torneo.jugadores,
      montoPremio: torneo.montoPremio,
      fechaInicio: torneo.fechaInicio,
      fechaFin: torneo.fechaFin
    };

    this.torneosService.create(torneoSinCategoria).subscribe({
        next: (nuevoTorneo) => {
          this.categoriasService.create({nombre: categoria, id_torneo: nuevoTorneo.id_torneo}).subscribe();

          this.cargarTorneos();
          this.toggleMenuTorneos();
        }
      });
  }

  eliminarTorneo(id: number): void {
    this.torneosService.remove(id).subscribe({
      next: () => {
        console.log('Torneo eliminado');
        this.cargarTorneos();
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  obtenerCategoriaTorneoSeleccionado(id: number): void {
    this.categoriasService.getById(id).subscribe({
      next: (c) => {
        this.categoriaTorneoSeleccionado = c;
        console.log('CATEGORIA DEL TORNEO SELECCIONADO:', this.categoriaTorneoSeleccionado);
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  toggleMenuAltaTorneo(): void {
    this.menu = 1;
  }

  toggleMenuTorneos(): void {
    this.menu = 0;
  }
}
