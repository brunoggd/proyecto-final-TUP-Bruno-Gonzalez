import { inject, Injectable } from '@angular/core';
import { Persona } from '../interfaces/persona.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl: string = 'http://localhost:3000/api/auth/register';

  private http = inject(HttpClient)

  register(persona: Omit<Persona, 'id_persona'>): Observable<Persona> {
    return this.http.post<Persona>(this.apiUrl, persona);
  }
}