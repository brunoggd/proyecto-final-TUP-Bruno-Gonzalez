import { Component, inject } from '@angular/core';
import { RegisterService } from '../../../../core/services/register.service';
import { Persona } from '../../../../core/interfaces/persona.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  private registerService = inject(RegisterService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  registerForm = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
    rol: ['', Validators.required],
    fecha_nacimiento: ['', Validators.required]
  });

  registrarse(): void {
    if (this.registerForm.valid) {
      const persona: Omit<Persona, 'id_persona'> = {
        ...(this.registerForm.value as Omit<Persona, 'id_persona'>),
        estaJugandoUnTorneo: false,
        torneosGanados: 0
      } 
      this.registerService.register(persona).subscribe({
        next: (res) => {
          console.log('Registro exitoso:', res, persona);
          this.router.navigate(['/torneos']);
        },
        error: (e) => {
          console.error(e);
        }
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
