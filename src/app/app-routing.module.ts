import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccederComponent } from './pages/acceder/acceder.component';
import { AcercaDeComponent } from './pages/acerca-de/acerca-de.component';
import { AdministradoresComponent } from './pages/administracion/administradores/administradores.component';
import { AsesoresComponent } from './pages/administracion/asesores/asesores.component';
import { ClientesComponent } from './pages/administracion/clientes/clientes.component';
import { ComprasComponent } from './pages/administracion/compras/compras.component';
import { ProductosComponent } from './pages/administracion/productos/productos.component';
import { BeneficiosComponent } from './pages/beneficios/beneficios.component';
import { ComoComprarComponent } from './pages/como-comprar/como-comprar.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';

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
  },
  {
    path: 'acceder',
    component: AccederComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
    path: 'administradores',
    component: AdministradoresComponent
  },
  {
    path: 'asesores',
    component: AsesoresComponent
  },
  {
    path: 'clientes',
    component: ClientesComponent
  },
  {
    path: 'productos',
    component: ProductosComponent
  },
  {
    path: 'compras',
    component: ComprasComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
