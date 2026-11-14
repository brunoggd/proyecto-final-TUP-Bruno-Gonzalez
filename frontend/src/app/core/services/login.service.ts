import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response.interface';

interface Persona {
  email: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/api/auth/login';

  private http = inject(HttpClient);

  login(p: Persona): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, p);
  }
}
