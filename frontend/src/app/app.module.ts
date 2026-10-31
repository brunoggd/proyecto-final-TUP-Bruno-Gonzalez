import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PersonaCardComponent } from './features/personas/components/persona-card/persona-card.component';
import { PersonasPageComponent } from './features/personas/pages/personas-page/personas-page.component';
import { TorneoCardComponent } from './features/torneos/components/torneo-card/torneo-card.component';
import { TorneosPageComponent } from './features/torneos/pages/torneos-page/torneos-page.component';
import { PartidoCardComponent } from './features/partidos/components/partido-card/partido-card.component';
import { PartidosPageComponent } from './features/partidos/pages/partidos-page/partidos-page.component';
import { RolCardComponent } from './features/roles/components/rol-card/rol-card.component';
import { RolesPageComponent } from './features/roles/pages/roles-page/roles-page.component';
import { CategoriaCardComponent } from './features/categorias/components/categoria-card/categoria-card.component';
import { CategoriasPageComponent } from './features/categorias/pages/categorias-page/categorias-page.component';
import { InscripcionCardComponent } from './features/inscripciones/components/inscripcion-card/inscripcion-card.component';
import { InscripcionesPageComponent } from './features/inscripciones/pages/inscripciones-page/inscripciones-page.component';
import { ParticipacionCardComponent } from './features/participaciones/components/participacion-card/participacion-card.component';
import { ParticipacionesPageComponent } from './features/participaciones/pages/participaciones-page/participaciones-page.component';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { Loader1Component } from './shared/components/loader-1/loader-1.component';
import { RouterLink } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HeaderComponent } from './shared/components/header/header.component';
import { RegisterFormComponent } from './features/register/components/register-form/register-form.component';
import { RegisterPageComponent } from './features/register/pages/register-page/register-page.component';
import { LoginFormComponent } from './features/login/components/login-form/login-form.component';
import { LoginPageComponent } from './features/login/pages/login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TorneoCardSmallComponent } from './features/torneos/components/torneo-card-small/torneo-card-small.component';
import { TorneoEditorComponent } from './features/torneos/components/torneo-editor/torneo-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonaCardComponent,
    PersonasPageComponent,
    TorneoCardComponent,
    TorneosPageComponent,
    PartidoCardComponent,
    PartidosPageComponent,
    RolCardComponent,
    RolesPageComponent,
    CategoriaCardComponent,
    CategoriasPageComponent,
    InscripcionCardComponent,
    InscripcionesPageComponent,
    ParticipacionCardComponent,
    ParticipacionesPageComponent,
    HomePageComponent,
    Loader1Component,
    HeaderComponent,
    RegisterFormComponent,
    RegisterPageComponent,
    LoginFormComponent,
    LoginPageComponent,
    TorneoCardSmallComponent,
    TorneoEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
