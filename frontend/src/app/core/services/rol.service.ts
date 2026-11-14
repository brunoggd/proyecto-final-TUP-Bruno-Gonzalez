import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from '../interfaces/rol.interface';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = 'http://localhost:3000/api/roles';
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

  getAll(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(rol: Omit<Rol, 'id_rol'>): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, rol, { headers: this.getHeaders() });
  }

  update(id: number, rol: Omit<Rol, 'id_rol'>): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/${id}`, rol, { headers: this.getHeaders() });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
