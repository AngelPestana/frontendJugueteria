import { Component, OnInit } from '@angular/core';
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

  dtOptions: DataTables.Settings = {};
  productos: Producto[] = [];
  producto: Producto[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  productosGetSubscription: Subscription | any;
  productoGetSubscription: Subscription | any;
  productoPostSubscription: Subscription | any;
  productoPutSubscription: Subscription | any;
  productoDeteleSubscription: Subscription | any;

  constructor(private spinner: NgxSpinnerService, private ps: ProductoService, private router: Router, private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.iniciarTabla();
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

  obtenerProductos() {
    this.spinner.show();//Mostramos el loading
    this.productosGetSubscription = this.ps.getProductos().subscribe((res: any) => {
      this.productos = res;
      //console.log(res);
      this.dtTrigger.next(0);
      this.cerrarLoading();
    }, (error => {
      //console.log(error);
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    }));
  }

  conversionImagen(imagen: string | any): SafeResourceUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + imagen);
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

  entroEnAgregar() {

  }

  entroEnGestion(id: number | undefined) {

  }

  cerrarLoading(): void {
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
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
