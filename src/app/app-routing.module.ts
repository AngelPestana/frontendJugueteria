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
import { CocinasComponent } from './pages/categorias/cocinas/cocinas.component';
import { LanzadoresComponent } from './pages/categorias/lanzadores/lanzadores.component';
import { VehiculosComponent } from './pages/categorias/vehiculos/vehiculos.component';
import { ComoComprarComponent } from './pages/como-comprar/como-comprar.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { ConstruccionComponent } from './pages/categorias/construccion/construccion.component';
import { MuniecosComponent } from './pages/categorias/muniecos/muniecos.component';
import { InfantilesComponent } from './pages/categorias/infantiles/infantiles.component';

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
  },
  {
    path: 'vehiculos',
    component: VehiculosComponent
  },
  {
    path: 'lanzadores',
    component: LanzadoresComponent
  },
  {
    path: 'cocinas',
    component: CocinasComponent
  },
  {
    path: 'construccion',
    component: ConstruccionComponent
  },
  {
    path: 'muniecos',
    component: MuniecosComponent
  },
  {
    path: 'infantiles',
    component: InfantilesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
