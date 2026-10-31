export interface Rol {
    id_rol: number;
    nombre: 'jugador' | 'organizador' | 'espectador';
    id_persona: number;
}