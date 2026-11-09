import { Torneo } from "./torneo.interface";

export interface CampoEditado {
    campo: keyof Torneo;
    valor: string | number;
}
