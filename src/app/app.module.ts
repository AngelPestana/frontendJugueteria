import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgwWowModule } from 'ngx-wow';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './includes/header/header.component';
import { FooterComponent } from './includes/footer/footer.component';
import { ComoComprarComponent } from './pages/como-comprar/como-comprar.component';
import { AcercaDeComponent } from './pages/acerca-de/acerca-de.component';
import { BeneficiosComponent } from './pages/beneficios/beneficios.component';
import { AccederComponent } from './pages/acceder/acceder.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { AdministradoresComponent } from './pages/administracion/administradores/administradores.component';
import { AsesoresComponent } from './pages/administracion/asesores/asesores.component';
import { ClientesComponent } from './pages/administracion/clientes/clientes.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ComoComprarComponent,
    AcercaDeComponent,
    BeneficiosComponent,
    AccederComponent,
    RegistroComponent,
    AdministradoresComponent,
    AsesoresComponent,
    ClientesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgwWowModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
