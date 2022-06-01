import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Details } from 'src/app/models/Details';
import { Producto } from 'src/app/models/Producto';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  formulario: any;
  estaBuscando = false;
  buscar = '';
  urlBaseBusqueda = 'http://localhost:8080/api/productos/vehiculos/busqueda1';
  urlBase = 'http://localhost:8080/api/productos/vehiculos';
  url = 'http://localhost:8080/api/productos/vehiculos';
  rutaImagenes = 'http://localhost/jugueteria/public/images/productos/';
  productos: Producto[] = [];
  producto: Producto[] = [];
  details: Details | any;//por objeto
  numbers: number[] = [];
  constructor(private ps: ProductoService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerProductos();
    this.formularioReactivo();
  }

  formularioReactivo(): void {
    this.formulario = new FormGroup({
      busqueda: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(15)
      ])
    });
    //console.log(this.formulario);
  }

  obtenerProductosBase() {
    this.estaBuscando = false;
    this.formulario.reset();
    this.spinner.show();//Mostramos el loading
    this.ps.getProductosCategoriaVehiculos(this.urlBase).subscribe((res: any) => {
      this.productos = res.productos;
      this.details = res.getDetails;
      //console.log(this.productos);
      //console.log(this.details);
      //console.log('siguiente: ' + this.details.next);
      //console.log('anterior: ' + this.details.previous);
      this.contar();
      this.cerrarLoading();
    }, (error => {
      //console.log(error);
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    }));
  }

  obtenerProductos() {
    this.spinner.show();//Mostramos el loading
    this.ps.getProductosCategoriaVehiculos(this.url).subscribe((res: any) => {
      this.productos = res.productos;
      this.details = res.getDetails;
      //console.log(this.productos);
      //console.log(this.details);
      //console.log('siguiente: ' + this.details.next);
      //console.log('anterior: ' + this.details.previous);
      this.contar();
      this.cerrarLoading();
    }, (error => {
      //console.log(error);
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    }));
  }

  cerrarLoading(): void {
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
  }

  contar() {
    this.numbers = [];
    for (let i = 1; i <= this.details.pageCount; i++) {
      this.numbers.push(i);
    }
  }

  mensajeError2(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: mensaje,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.router.navigate(['/home']);//Para que me rediriga a la pagina de inicio
      }
    })
  }

  mostrarOtrosProductos(otroUrl: string) {
    //console.log(otroUrl);
    this.url = otroUrl;
    console.log(this.url);
    this.obtenerProductos();
  }

  mostrarOtrosProductos2(otroUrl: string) {
    //console.log(otroUrl);
    this.estaBuscando = true;
    this.buscar = this.formularioControl.busqueda.value;
    this.url = otroUrl + '/' + this.formularioControl.busqueda.value;
    this.obtenerProductos();
  }

  get formularioControl() {//NO borrar
    return this.formulario.controls;
  }

}
