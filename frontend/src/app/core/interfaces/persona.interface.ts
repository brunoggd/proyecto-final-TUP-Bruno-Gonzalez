export interface Persona {
    id_persona: number;
    nombre: string;
    apellido: string;
    contrasena: string;
    email: string;
    fecha_nacimiento: string;
    estaJugandoUnTorneo: boolean;
    torneosGanados: number;
    rol: string;
}