import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { Producto } from 'src/app/models/Producto';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  aceptacionFile: string = 'image/*';
  dire: string = '';
  dtOptions: DataTables.Settings = {};
  productos: Producto[] = [];
  producto: Producto[] = [];
  estaEnGestion: boolean = false;
  dtTrigger: Subject<any> = new Subject<any>();
  productosGetSubscription: Subscription | any;
  productoGetSubscription: Subscription | any;
  productoPostSubscription: Subscription | any;
  productoPutSubscription: Subscription | any;
  productoDeteleSubscription: Subscription | any;

  constructor(private spinner: NgxSpinnerService, private ps: ProductoService, private router: Router, private _sanitizer: DomSanitizer) { }

  rutaImagenes = 'http://localhost/jugueteria/public/images/productos/';
  formulario: any;
  ngOnInit(): void {
    this.formularioReactivo();
    this.iniciarTabla();
  }

  formularioReactivo(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl('', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(45),
        Validators.pattern("[A-Za-z0-9]{3,45}")
      ]),
      imagen: new FormControl('', [
        Validators.required
      ]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(255),
        Validators.pattern("[A-Za-z0-9]{3,45}")
      ]),
      precio: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern("[0-9]+(.[0-9]{2})?")
      ]),
      cantidad: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern("[0-9]+")
      ]),
      categoria: new FormControl('', [
        Validators.required
      ])
    });
    //console.log(this.formulario);
  }

  iniciarTabla() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      language: {
        url: '//cdn.datatables.net/plug-ins/1.11.3/i18n/es-mx.json'
      }
    };
    this.obtenerProductos();
  }

  onFileChanges(files: { base64: string; }[]) {
  console.log(files);
  this.dire = files[0].base64;
  }

  obtenerProductos() {
    this.spinner.show();//Mostramos el loading
    this.productosGetSubscription = this.ps.getProductos().subscribe((res: any) => {
      this.productos = res;
      //console.log(res);
      this.dtTrigger.next(0);
      //console.log(this.productos[1].imagen);
      //this.productos['imagen'] = this._sanitizer.bypassSecurityTrustResourceUrl(this.productos['imagen']);
      this.cerrarLoading();
    }, (error => {
      //console.log(error);
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    }));
  }
/*
  conversionImagen(imagen: string | any): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imagen);
  }
*/
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

  entroEnAgregar() {
    this.estaEnGestion = false;
    this.formulario.reset();//vaciamos el formulario
    this.dire = '';//vaciamos la vista de imagen
  }

  entroEnGestion(id: number) {
    this.estaEnGestion = true;
    this.formulario.reset();//vaciamos el formulario
    this.dire = '';//vaciamos la vista de imagen
    this.spinner.show();//Mostramos el loading
    this.productoGetSubscription = this.ps.getProducto(id).subscribe((res: any) => {
      //dentro del subscribe estaran los datos consultados de la api, fuera de este no tendras nada
      this.producto = res;
      //console.log(this.administrador);
      this.presentandoDatos();
    });
  }

  cerrarLoading(): void {
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
  }

  editarProducto() {
    this.spinner.show();//Mostramos el loading
    //console.log('con que quieres agregar verdad prro!!');
    let producto = new Producto();
    let base64 = this.dire.split(',')[1];
    producto.nombre = this.formulario.value.nombre;
    producto.imagen = base64;
    producto.descripcion = this.formulario.value.descripcion;
    producto.precio = this.formulario.value.precio;
    producto.cantidad = this.formulario.value.cantidad;
    producto.idCategoria = this.formulario.value.categoria;
    let imagen = this.formulario.value.imagen;
    //console.log(typeof(imagen));
    //console.log(producto);
    this.productoPutSubscription = this.ps.putProducto(producto, this.producto['id']).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se editó el producto con exito!!';
      this.mensajeExito(mensaje);
    }, (error: any) => {
      this.cerrarLoading();
      //console.log(error);
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError(mensajeError);
    });
  }

  eliminarProducto() {
    this.spinner.show();//Mostramos el loading
    //console.log('con que quieres eliminar verdad prro!!');
    this.productoDeteleSubscription = this.ps.deleteProducto(this.producto['id']).subscribe((res: any) => {
      this.cerrarLoading();
      let mensaje = 'Se eliminó el producto con exito!!';
      this.mensajeExito(mensaje);
    }, (error: any) => {
      this.cerrarLoading();
      //console.log(error);
      let mensajeError = error.error.messages.error;//no es necesario eliminar etiquetas ya que el metodo delete del api
      //no devuelve mensajes con etiquetas
      this.mensajeError(mensajeError);
    });
  }

  agregarProducto() {
    this.spinner.show();//Mostramos el loading
    //console.log('con que quieres agregar verdad prro!!');
    let producto = new Producto();
    let base64 = this.dire.split(',')[1];
    producto.nombre = this.formulario.value.nombre;
    producto.imagen = base64;
    producto.descripcion = this.formulario.value.descripcion;
    producto.precio = this.formulario.value.precio;
    producto.cantidad = this.formulario.value.cantidad;
    producto.idCategoria = this.formulario.value.categoria;
    //console.log(producto);
    this.productoPostSubscription = this.ps.postProducto(producto).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se agregó el producto con exito!!';
      this.mensajeExito(mensaje);
    }, (error: any) => {
      this.cerrarLoading();
      //console.log(error);
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError(mensajeError);
    });
  }

  mensajeExito(mensaje: string) {
    Swal.fire({
      icon: 'success',
      title: mensaje,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        window.location.reload();//Para que actualice la tabla
      }
    })
  }

  mensajeError(mensajeError: string) {
    Swal.fire({
      icon: 'error',
      title: mensajeError
    })
  }

  presentandoDatos() {
    this.formulario.patchValue({
      //mandamos la imagen al formulario reactivo formcontrolname imagen
      nombre: this.producto['nombre'],
      descripcion: this.producto['descripcion'],
      precio: this.producto['precio'],
      cantidad: this.producto['cantidad'],
      categoria: this.producto['idCategoria']
    });
    this.dire = 'data:image/jpeg;base64,' + this.producto['imagen'];
    this.cerrarLoading();
  }

  get formularioControl() {//NO borrar
    return this.formulario.controls;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
    this.productosGetSubscription.unsubscribe();
    if (this.productoGetSubscription != null || this.productoGetSubscription != undefined) {
      this.productoGetSubscription.unsubscribe();
      //console.log('se elimino el get edit')
    }

    if (this.productoPostSubscription != null || this.productoPostSubscription != undefined) {
      this.productoPostSubscription.unsubscribe();
      //console.log('se elimino el post')
    }

    if (this.productoPutSubscription != null || this.productoPutSubscription != undefined) {
      this.productoPutSubscription.unsubscribe();
      //console.log('se elimino el put')
    }

    if (this.productoDeteleSubscription != null || this.productoDeteleSubscription != undefined) {
      this.productoDeteleSubscription.unsubscribe();
      //console.log('se elimino el delete')
    }
    //console.log('ngOnDestroy iniciado');
  }

}
