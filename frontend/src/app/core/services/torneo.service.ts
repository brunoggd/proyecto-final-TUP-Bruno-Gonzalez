import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Torneo } from '../interfaces/torneo.interface';
import { JugadorInscripto } from '../interfaces/jugador-inscripto';
import { PartidoDTO } from '../interfaces/partido-dto.interface';
import { SedeTorneo } from '../interfaces/sede-torneo.interface';
import { TorneoAlta } from '../interfaces/torneo-alta.interface';
import { PaginatedResult } from '../interfaces/paginated-result.interface';

@Injectable({
  providedIn: 'root'
})
export class TorneoService {
  private apiUrl: string = 'http://localhost:3000/api/torneos';
  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    const token: string | null = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    // console.log(headers.get('Authorization'));
    return headers;
  }

  getAll(limit: number, offset: number): Observable<PaginatedResult<Torneo>> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);

    return this.http.get<PaginatedResult<Torneo>>(this.apiUrl, {params,headers: this.getHeaders()});
  }

  getById(id: number): Observable<Torneo> {
    return this.http.get<Torneo>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  filtrar(nombre?: string, categoria?: string, sede?: string, limit: number = 10, offset: number = 0): Observable<PaginatedResult<Torneo>> {
    let params = new HttpParams().set('limit', limit).set('offset', offset);

    if (nombre?.trim()) {
      params = params.set('nombre', nombre.trim());
    }

    if (categoria?.trim()) {
      params = params.set('categoria', categoria.trim());
    }

    if (sede?.trim()) {
      params = params.set('sede', sede.trim());
    }

    return this.http.get<PaginatedResult<Torneo>>(`${this.apiUrl}/filtrar`,{ params, headers: this.getHeaders() });
  }

  getSedes(): Observable<SedeTorneo[]> {
    return this.http.get<SedeTorneo[]>(`${this.apiUrl}/sedes`, { headers: this.getHeaders() });
  }

  create(torneo: TorneoAlta): Observable<Torneo> {
    return this.http.post<Torneo>(this.apiUrl, torneo, { headers: this.getHeaders() });
  }

  update(id: number, torneo: TorneoAlta): Observable<Torneo> {
    return this.http.put<Torneo>(`${this.apiUrl}/${id}`, torneo, { headers: this.getHeaders() });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getPlayers(id: number): Observable<JugadorInscripto[]> {
    return this.http.get<JugadorInscripto[]>(`${this.apiUrl}/jugadores/${id}`, { headers: this.getHeaders() });
  }

  getMatches(idTorneo: number) {
    return this.http.get<PartidoDTO[]>(`${this.apiUrl}/partidos/${idTorneo}`, { headers: this.getHeaders() });
  }

  getMine(limit: number, offset: number): Observable<PaginatedResult<Torneo>> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);

    return this.http.get<PaginatedResult<Torneo>>(`${this.apiUrl}/mis-torneos`,{ params, headers: this.getHeaders() });
  }
}
