import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Persona } from '../interfaces/persona.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private apiUrl = 'http://localhost:3000/api/personas';
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

  getAll(): Observable<Persona[]> {
    return this.http.get<Persona[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<Persona> {
    return this.http.get<Persona>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(persona: Omit<Persona, 'id_persona'>): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, persona, { headers: this.getHeaders() });
  }

  update(id: number, persona: Omit<Persona, 'id_persona'>): Observable<Persona> {
    return this.http.put<Persona>(`${this.apiUrl}/${id}`, persona, { headers: this.getHeaders() });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
