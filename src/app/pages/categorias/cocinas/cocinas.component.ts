import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Details } from 'src/app/models/Details';
import { Producto } from 'src/app/models/Producto';
import { CarritoService } from 'src/app/services/carrito.service';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cocinas',
  templateUrl: './cocinas.component.html',
  styleUrls: ['./cocinas.component.css']
})
export class CocinasComponent implements OnInit {

  formulario: any;
  estaBuscando = false;
  buscar = '';
  urlBaseBusqueda = 'http://localhost:8080/api/productos/cocina/busqueda3';
  urlBase = 'http://localhost:8080/api/productos/cocina';
  url = 'http://localhost:8080/api/productos/cocina';
  rutaImagenes = 'http://localhost/jugueteria/public/images/productos/';
  productos: Producto[] = [];
  producto: Producto[] = [];
  details: Details | any;//por objeto
  numbers: number[] = [];
  constructor(private ps: ProductoService, private spinner: NgxSpinnerService, private router: Router, private c: CarritoService) { }

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

  cortarCadena(cadena: string): string {
    if (cadena.length > 50) {
      return cadena.substring(0, 50) + '...';
    } else {
      return cadena;
    }
  }

  agregarCarrito(producto): void {
    if (this.c.obtenerContador() < 30){
      this.c.agregarProducto(producto);
      console.log(this.c.obtenerProductos());
      console.log('contador: ' + this.c.obtenerContador());
    }else {
      let mensaje = 'No puedes agregar más de 30 productos al carrito';
      this.mensajeError(mensaje);
    }
    
  }

  mensajeError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: mensaje,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    });
  }

  get formularioControl() {//NO borrar
    return this.formulario.controls;
  }

  checarId(id: number): boolean {
    //Obtenemos los productos del servicio y comparamos con los ids agregados
    let productos = this.c.obtenerProductos();
    //usamos un foreach para iterar sobre los productos agregados en el arreglo e identificar si existe el id relacionado
    for (let i = 0; i < productos.length; i++) {
      if (productos[i]['id'] == id) {
        //si esto es verdad, entonces desactivame el boton
        return true;
      }
    }
    return false;

  }

}
