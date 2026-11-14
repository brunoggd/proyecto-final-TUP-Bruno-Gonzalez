import { inject, Injectable } from '@angular/core';
import { Persona } from '../interfaces/persona.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../interfaces/auth-response.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl: string = 'http://localhost:3000/api/auth/register';

  private http = inject(HttpClient)

  register(persona: Omit<Persona, 'id_persona'>): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, persona);
  }
}