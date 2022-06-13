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
    //console.log(producto);
    //this.ps.agregarCarrito(producto);
    /*
    this.idsAgregados[this.contadorParaLosIDs] = producto.id;
    this.contadorParaLosIDs++;
    if (this.contador >= 20){
      console.log("Ya no puedes agregar mas articulos kbron!!!!")
    }else {
      this.contador = this.contador + 1;
      this.c.enviarContador(this.contador);
    }*/
    this.c.agregarProducto(producto);
    console.log(this.c.obtenerProductos());
  }

  get formularioControl() {//NO borrar
    return this.formulario.controls;
  }

  checarId(id: number): boolean {
    //haremos un foreach para los ids agregados del array
    /*for (let i = 0; i < this.idsAgregados.length; i++) {
      if (this.idsAgregados[i] == id) {
        //si esto es verdad, entonces desactivame el boton
        return true;
      }
    }
    return false;*/
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
