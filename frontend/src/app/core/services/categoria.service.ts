import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../interfaces/categoria.interface';
import { NombreCategoria } from '../interfaces/nombre-categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:3000/api/categorias';
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

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getNames(): Observable<NombreCategoria[]> {
    return this.http.get<NombreCategoria[]>(`${this.apiUrl}/nombres`, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  create(categoria: Omit<Categoria, 'id_categoria'>): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria, { headers: this.getHeaders() });
  }

  update(id: number, categoria: Omit<Categoria, 'id_categoria'>): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria, { headers: this.getHeaders() });
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
