export interface Torneo {
    id_torneo: number;
    id_creador: number;
    id_categoria: number;
    nombre: string;
    ubicacion: string;
    jugadores: number;
    estado: 'inscripcion_abierta' | 'en_curso' | 'finalizado';
    montoPremio: number;
    fechaInicio: string;
    fechaFin: string;
}