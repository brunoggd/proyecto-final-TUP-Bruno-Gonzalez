export interface PartidoDTO {
    id_partido: number;
    numero_ronda: number;
    numero_partido: number;
    fecha: string;
    hora: string;
    ganador: number | null;
    id_jugador1: number;
    nombre_jugador1: string;
    apellido_jugador1: string;
    id_jugador2: number;
    nombre_jugador2: string;
    apellido_jugador2: string;
}