export type CampoTorneoEditable =
    | 'nombre'
    | 'ubicacion'
    | 'jugadores'
    | 'montoPremio'
    | 'fechaInicio'
    | 'fechaFin'
    | 'id_categoria';

export interface CampoEditado {
    campo: CampoTorneoEditable;
    valor: string | number;
}
