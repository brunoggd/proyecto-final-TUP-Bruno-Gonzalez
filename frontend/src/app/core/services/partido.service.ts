import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Partido } from '../interfaces/partido.interface';
import { SetPartido } from '../interfaces/set-partido.interface';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {
  private apiUrl = 'http://localhost:3000/api/partidos';
  private http = inject(HttpClient);

  private partidoSubject = new BehaviorSubject<number | null>(null);
  actualizacion$ = this.partidoSubject.asObservable();

  notificar(idPartido: number): void {
    this.partidoSubject.next(idPartido);
  }

  getAll(): Observable<Partido[]> {
    return this.http.get<Partido[]>(this.apiUrl);
  }

  getById(id: number): Observable<Partido> {
    return this.http.get<Partido>(`${this.apiUrl}/${id}`);
  }

  getSetsByMatch(id: number): Observable<SetPartido[]> {
    return this.http.get<SetPartido[]>(`${this.apiUrl}/sets/${id}`);
  }

  create(partido: Omit<Partido, 'id_partido'>): Observable<Partido> {
    return this.http.post<Partido>(this.apiUrl, partido);
  }

  createSet(idPartido: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/sets/${idPartido}`, {});
}

  update(id: number, partido: Omit<Partido, 'id_partido'>): Observable<Partido> {
    return this.http.put<Partido>(`${this.apiUrl}/${id}`, partido);
  }

  updateSets(idPartido: number, sets: SetPartido[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/sets/${idPartido}`,sets);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  removeSet(idSet: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sets/${idSet}`);
}
}
