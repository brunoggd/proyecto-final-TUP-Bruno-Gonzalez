import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inscripcion } from '../interfaces/inscripcion.interface';

@Injectable({
  providedIn: 'root'
})
export class InscripcionService {
  private apiUrl = 'http://localhost:3000/api/inscripciones';
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

  getAll(): Observable<Inscripcion[]> {
    return this.http.get<Inscripcion[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<Inscripcion> {
    return this.http.get<Inscripcion>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(inscripcion: Omit<Inscripcion, 'id_inscripcion'>): Observable<Inscripcion> {
    return this.http.post<Inscripcion>(this.apiUrl, inscripcion, { headers: this.getHeaders() });
  }

  update(id: number, inscripcion: Omit<Inscripcion, 'id_inscripcion'>): Observable<Inscripcion> {
    return this.http.put<Inscripcion>(`${this.apiUrl}/${id}`, inscripcion, { headers: this.getHeaders() });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
