export interface Torneo {
    id_torneo: number;
    nombre: string;
    ubicacion: string;
    jugadores: number;
    premio: boolean;
    montoPremio: number;
    fechaInicio: string;
    fechaFin: string;
}
