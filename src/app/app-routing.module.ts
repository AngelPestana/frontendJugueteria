import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
