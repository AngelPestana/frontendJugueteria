import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgwWowService } from 'ngx-wow';
import { Producto } from 'src/app/models/Producto';
import { CarritoService } from 'src/app/services/carrito.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  rutaImagenes = 'http://localhost/jugueteria/public/images/productos/';
  ubicacionLogo: string = '../../../assets/img/logo/coppel2.png';
  nombre: string | null = '';
  apellidos: string | null = '';
  id_rol: string | null = '';
  contador: number = 0;
  productos: Producto[] = [];

  constructor(private wowService: NgwWowService, private router: Router, private c: CarritoService) {
    this.wowService.init();//No borrar si quieres animaciones del prro chems wow.js
  }

  ngOnInit(): void {
    this.valores();
    this.getContador();
    this.c.enviarContadorObservable.subscribe(res => {
      this.contador = res;
    });
  }

  getContador() {
    this.contador = this.c.obtenerContador();
    this.productos = this.c.obtenerProductos();
    console.log(this.productos);
  }

  valores() {
    if (localStorage.getItem('token') != null) {
      this.nombre = localStorage.getItem('nombre');
      this.apellidos = localStorage.getItem('apellidos');
      this.id_rol = localStorage.getItem('id_rol');
      this.checarExpiracion();
    }
  }

  checarExpiracion() {
    let date = new Date();
    let time = date.getTime();
    let tiempoExpirado: string | any = localStorage.getItem('tiempoExpirado');
    let timeExpiradoInt = parseInt(tiempoExpirado);
    if (time >= timeExpiradoInt){
      this.salirPorSesionExpirada();
    }
  }

  salirPorSesionExpirada() {
    localStorage.clear();
    this.nombre = '';
    this.id_rol = '';
    this.router.navigate(['/acceder']);
    this.mensajeCerroSesionPorExpiracion();
  }

  mensajeCerroSesionPorExpiracion() {
    Swal.fire({
      title: 'Sesión cerrada por expiración de la sesión!',
      text: 'si gusta seguir, favor de iniciar sesión nuevamente',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

  eliminarProducto(producto: Producto) {
    this.c.eliminarProducto(producto);
  }

}
