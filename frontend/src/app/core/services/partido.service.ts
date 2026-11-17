import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private getHeaders(): HttpHeaders {
    const token: string | null = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    // console.log(headers.get('Authorization'));
    return headers;
  }

  private partidoSubject = new BehaviorSubject<number | null>(null);
  actualizacion$ = this.partidoSubject.asObservable();

  notificar(idPartido: number): void {
    this.partidoSubject.next(idPartido);
  }

  getAll(): Observable<Partido[]> {
    return this.http.get<Partido[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<Partido> {
    return this.http.get<Partido>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getSetsByMatch(id: number): Observable<SetPartido[]> {
    return this.http.get<SetPartido[]>(`${this.apiUrl}/sets/${id}`, { headers: this.getHeaders() });
  }

  create(partido: Omit<Partido, 'id_partido'>): Observable<Partido> {
    return this.http.post<Partido>(this.apiUrl, partido, { headers: this.getHeaders() });
  }

  createSet(idPartido: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/sets/${idPartido}`, {}, { headers: this.getHeaders() });
}

  update(id: number, partido: Omit<Partido, 'id_partido'>): Observable<Partido> {
    return this.http.put<Partido>(`${this.apiUrl}/${id}`, partido, { headers: this.getHeaders() });
  }

  updateSets(idPartido: number, sets: SetPartido[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/sets/${idPartido}`,sets, { headers: this.getHeaders() });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  removeSet(idSet: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sets/${idSet}`, { headers: this.getHeaders() });
}
}
