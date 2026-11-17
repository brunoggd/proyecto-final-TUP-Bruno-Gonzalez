import { Injectable } from '@angular/core';

export interface UsuarioPayload {
  id: number;
  nombre: string;
  rol: 'organizador' | 'jugador' | 'espectador';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  get token(): string | null {
    return sessionStorage.getItem('token');
  }

  get payload(): UsuarioPayload | null {
    const token = this.token;

    if (!token) { return null; }

    try {
      return JSON.parse(atob(token.split('.')[1]));

    } catch {
      return null;
    }
  }

  get usuarioId(): number | null {
    return this.payload?.id ?? null;
  }

  get nombre(): string | null {
    return this.payload?.nombre ?? null;
  }

  get rol(): string | null {
    return this.payload?.rol ?? null;
  }

  get autenticado(): boolean {
    return !!this.token;
    // El doble !! lo convierte a booleano
  }

  esOrganizador(): boolean {
    return this.rol === 'organizador';
  }

  esJugador(): boolean {
    return this.rol === 'jugador';
  }

  esEspectador(): boolean {
    return this.rol === 'espectador';
  }

  logout(): void {
    sessionStorage.removeItem('token');
  }
}
