import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Torneo } from '../interfaces/torneo.interface';

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

  create(torneo: Omit<Torneo, 'id_torneo'>): Observable<Torneo> {
    return this.http.post<Torneo>(this.apiUrl, torneo);
  }

  update(id: number, torneo: Omit<Torneo, 'id_torneo'>): Observable<Torneo> {
    return this.http.put<Torneo>(`${this.apiUrl}/${id}`, torneo);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
