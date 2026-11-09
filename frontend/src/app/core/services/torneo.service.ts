import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Torneo } from '../interfaces/torneo.interface';
import { JugadorInscripto } from '../interfaces/jugador-inscripto';
import { PartidoDTO } from '../interfaces/partido-dto.interface';
import { SedeTorneo } from '../interfaces/sede-torneo.interface';

@Injectable({
  providedIn: 'root'
})
export class TorneoService {
  private apiUrl: string = 'http://localhost:3000/api/torneos';
  private http = inject(HttpClient);

  getAll(): Observable<Torneo[]> {
    return this.http.get<Torneo[]>(this.apiUrl);
  }

  getById(id: number): Observable<Torneo> {
    return this.http.get<Torneo>(`${this.apiUrl}/${id}`);
  }

  filtrar(
    nombre?: string,
    categoria?: string,
    sede?: string
  ): Observable<Torneo[]> {

    let params = new HttpParams();

    if (nombre) {
      params = params.set('nombre', nombre);
    }

    if (categoria) {
      params = params.set('categoria', categoria);
    }

    if (sede) {
      params = params.set('sede', sede);
    }

    return this.http.get<Torneo[]>(`${this.apiUrl}/filtrar`, { params });
  }

  getSedes(): Observable<SedeTorneo[]> {
    return this.http.get<SedeTorneo[]>(`${this.apiUrl}/sedes`);
  }

  create(torneo: Omit<Torneo, 'id_torneo'>): Observable<Torneo> {
    return this.http.post<Torneo>(this.apiUrl, torneo);
  }

  update(id: number, torneo: Omit<Torneo, 'id_torneo'>): Observable<Torneo> {
    return this.http.put<Torneo>(`${this.apiUrl}/${id}`, torneo);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPlayers(id: number): Observable<JugadorInscripto[]> {
    return this.http.get<JugadorInscripto[]>(`${this.apiUrl}/jugadores/${id}`);
  }

  getMatches(idTorneo: number) {
    return this.http.get<PartidoDTO[]>(`${this.apiUrl}/partidos/${idTorneo}`);
  }
}
