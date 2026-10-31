import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Persona {
  email: string;
  contrasena: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/api/auth/login';

  private http = inject(HttpClient);

  login(p: Persona): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, p);
  }
}
