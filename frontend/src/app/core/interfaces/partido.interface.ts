export interface Partido {
    id_partido: number;
    id_torneo: number;
    ganador: number;
    fecha: string;
    hora: string;
    resultado: string;
    games: number;
    sets: number;
}