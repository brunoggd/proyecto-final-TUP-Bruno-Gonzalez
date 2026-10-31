import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Participacion } from '../interfaces/participacion.interface';

@Injectable({
  providedIn: 'root'
})
export class ParticipacionService {
  private apiUrl = 'http://localhost:3000/api/participaciones';
  private http = inject(HttpClient);

  getAll(): Observable<Participacion[]> {
    return this.http.get<Participacion[]>(this.apiUrl);
  }

  getById(id: number): Observable<Participacion> {
    return this.http.get<Participacion>(`${this.apiUrl}/${id}`);
  }

  create(participacion: Omit<Participacion, 'id_participacion'>): Observable<Participacion> {
    return this.http.post<Participacion>(this.apiUrl, participacion);
  }

  update(id: number, participacion: Omit<Participacion, 'id_participacion'>): Observable<Participacion> {
    return this.http.put<Participacion>(`${this.apiUrl}/${id}`, participacion);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
