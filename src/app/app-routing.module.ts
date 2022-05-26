import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcercaDeComponent } from './pages/acerca-de/acerca-de.component';
import { BeneficiosComponent } from './pages/beneficios/beneficios.component';
import { ComoComprarComponent } from './pages/como-comprar/como-comprar.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { 
    path: '',
    redirectTo: '/home',
    pathMatch: 'full' 
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'como_comprar',
    component: ComoComprarComponent
  },
  {
    path: 'acerca_de',
    component: AcercaDeComponent
  },
  {
    path: 'beneficios',
    component: BeneficiosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
