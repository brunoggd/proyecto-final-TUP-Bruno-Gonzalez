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
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-torneos-page',
  templateUrl: './torneos-page.component.html',
  styleUrl: './torneos-page.component.css'
})
export class TorneosPageComponent implements OnInit {
  torneos: Torneo[] = [];
  categorias: Categoria[] = [];
  sedes: SedeTorneo[] = []

  jugadoresInscriptos: JugadorInscripto[] = [];
  partidos: PartidoDTO[] = [];

  private torneosService = inject(TorneoService);
  private categoriasService = inject(CategoriaService);
  private inscripcionesService = inject(InscripcionService);

  private authService = inject(AuthService);

  torneoSeleccionado!: Torneo;
  categoriaTorneoSeleccionado!: Categoria;

  nombreTorneo: string = '';
  categoriaSeleccionada: string = '';
  sedeSeleccionada: string = '';

  private timeOut?: ReturnType<typeof setTimeout>;

  menu: number = 0;

  verSoloMisTorneos: boolean = true;

  torneoEditorHabilitado: boolean = false;

  esMiTorneo(torneo: Torneo): boolean {
    return (torneo.id_creador === this.authService.usuarioId);
  }

  cargarTorneos(): void {
    const observableTorneos: Observable<Torneo[]> = this.verSoloMisTorneos ? this.torneosService.getMine() : this.torneosService.getAll();

    observableTorneos.subscribe({
      next: (d) => {
        this.torneos = d;
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  cargarSedes(): void {
    this.torneosService.getSedes().subscribe({
      next: (data) => {
        this.sedes = data;
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  ngOnInit(): void {
    this.cargarTorneos();
    this.cargarSedes();

    this.categoriasService.getAll().subscribe({
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
        this.obtenerCategoriaTorneoSeleccionado(data.id_categoria);
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
  }

  seleccionarTorneo(torneo: Torneo): void {
    if (!this.esMiTorneo(torneo)) { return; }

    this.obtenerTorneo(torneo.id_torneo);
    this.torneoEditorHabilitado = true;
  }

  guardarCambios(t: Torneo): void {
    const torneoMod: TorneoAlta = {
      id_categoria: t.id_categoria,
      nombre: t.nombre,
      ubicacion: t.ubicacion,
      jugadores: Number(t.jugadores),
      montoPremio: Number(t.montoPremio),
      fechaInicio: t.fechaInicio,
      fechaFin: t.fechaFin
    };

    this.torneosService.update(t.id_torneo, torneoMod).subscribe({
      next: () => {
        this.refrescarTorneoActual();
        this.cargarSedes();
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  eliminarInscripcion(idInscripcion: number): void {
    this.inscripcionesService.remove(idInscripcion).subscribe({
      next: () => {
        this.refrescarTorneoActual();
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  crearTorneo(torneo: TorneoAlta): void {
    this.torneosService.create(torneo).subscribe({
        next: () => {
          this.cargarTorneos();
          this.cargarSedes();
          this.toggleMenuTorneos();
        }
      });
  }

  eliminarTorneo(id: number): void {
    this.torneosService.remove(id).subscribe({
      next: () => {
        this.cargarTorneos();
        this.cargarSedes();

        console.log('Torneo eliminado');
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

  refrescarTorneoActual(): void {
    const id = this.torneoSeleccionado.id_torneo;

    this.cargarTorneos();

    this.obtenerTorneoPorId(id);
    this.obtenerJugadoresInscriptos(id);
    this.obtenerPartidosDelTorneo(id);

    this.categoriasService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
      }
    });
  }


  toggleMenuAltaTorneo(): void {
    this.menu = 1;
  }

  toggleMenuTorneos(): void {
    this.menu = 0;
  }

  toggleEditorTorneo(value: boolean): void {
    this.torneoEditorHabilitado = value;
  }
}
