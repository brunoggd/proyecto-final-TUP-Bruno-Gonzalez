import { Categoria } from "./categoria.interface";
import { Torneo } from "./torneo.interface";

export type CampoTorneoEditable = keyof Torneo | 'categoria';

export interface CampoEditado {
    campo: CampoTorneoEditable;
    valor: string | number | Categoria;
}
