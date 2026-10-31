import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Partido } from '../interfaces/partido.interface';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {
  private apiUrl = 'http://localhost:3000/api/partidos';
  private http = inject(HttpClient);

  getAll(): Observable<Partido[]> {
    return this.http.get<Partido[]>(this.apiUrl);
  }

  getById(id: number): Observable<Partido> {
    return this.http.get<Partido>(`${this.apiUrl}/${id}`);
  }

  create(partido: Omit<Partido, 'id_partido'>): Observable<Partido> {
    return this.http.post<Partido>(this.apiUrl, partido);
  }

  update(id: number, partido: Omit<Partido, 'id_partido'>): Observable<Partido> {
    return this.http.put<Partido>(`${this.apiUrl}/${id}`, partido);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
