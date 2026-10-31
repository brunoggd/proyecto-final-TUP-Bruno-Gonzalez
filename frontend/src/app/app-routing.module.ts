import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { CategoriasPageComponent } from './features/categorias/pages/categorias-page/categorias-page.component';
import { InscripcionesPageComponent } from './features/inscripciones/pages/inscripciones-page/inscripciones-page.component';
import { ParticipacionesPageComponent } from './features/participaciones/pages/participaciones-page/participaciones-page.component';
import { PartidosPageComponent } from './features/partidos/pages/partidos-page/partidos-page.component';
import { PersonasPageComponent } from './features/personas/pages/personas-page/personas-page.component';
import { RolesPageComponent } from './features/roles/pages/roles-page/roles-page.component';
import { TorneosPageComponent } from './features/torneos/pages/torneos-page/torneos-page.component';
import { LoginPageComponent } from './features/login/pages/login-page/login-page.component';
import { RegisterPageComponent } from './features/register/pages/register-page/register-page.component';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'categorias', component: CategoriasPageComponent},
  {path: 'inscripciones', component: InscripcionesPageComponent},
  {path: 'participaciones', component: ParticipacionesPageComponent},
  {path: 'partidos', component: PartidosPageComponent},
  {path: 'personas', component: PersonasPageComponent},
  {path: 'roles', component: RolesPageComponent},
  {path: 'torneos', component: TorneosPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
