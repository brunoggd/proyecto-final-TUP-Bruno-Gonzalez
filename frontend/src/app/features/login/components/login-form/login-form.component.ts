import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from '../../../../core/services/login.service';
import { Router } from '@angular/router';

interface LoginInfo {
  email: string;
  contrasena: string;
}

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  private loginService = inject(LoginService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  readonly error = signal<string | null>(null);

  loginForm = this.fb.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    contrasena: this.fb.nonNullable.control('', Validators.required)
  });

  iniciarSesion(): void {
    if (this.loginForm.valid) {
      const login = this.loginForm.value as LoginInfo;
      this.loginService.login(login).subscribe({
        next: (res) => {
          console.log('Login exitoso, token:', res.token);
          this.router.navigate(['/torneos']);
        },
        error: (e: Error) => {
          this.error.set(e.message);
          console.error(e);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
