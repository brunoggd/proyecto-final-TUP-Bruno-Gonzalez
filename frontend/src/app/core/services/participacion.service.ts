import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Participacion } from '../interfaces/participacion.interface';

@Injectable({
  providedIn: 'root'
})
export class ParticipacionService {
  private apiUrl = 'http://localhost:3000/api/participaciones';
  private http = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    const token: string | null = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log(headers.get('Authorization'));
    return headers;
  }

  getAll(): Observable<Participacion[]> {
    return this.http.get<Participacion[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<Participacion> {
    return this.http.get<Participacion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(participacion: Omit<Participacion, 'id_participacion'>): Observable<Participacion> {
    return this.http.post<Participacion>(this.apiUrl, participacion, { headers: this.getHeaders() });
  }

  update(id: number, participacion: Omit<Participacion, 'id_participacion'>): Observable<Participacion> {
    return this.http.put<Participacion>(`${this.apiUrl}/${id}`, participacion, { headers: this.getHeaders() });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
