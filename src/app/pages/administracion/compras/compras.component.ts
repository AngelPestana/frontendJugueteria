import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { Compra } from 'src/app/models/Compra';
import { CompraService } from 'src/app/services/compra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  compras: Compra[] = [];
  compra: Compra[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  comprasGetSubscription: Subscription | any;
  compraGetSubscription: Subscription | any;
  compraPostSubscription: Subscription | any;
  compraPutSubscription: Subscription | any;
  compraDeteleSubscription: Subscription | any;

  constructor(private spinner: NgxSpinnerService, private cs: CompraService, private router: Router) { }

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
    this.obtenerCompras();
  }

  obtenerCompras() {
    this.spinner.show();//Mostramos el loading
    this.comprasGetSubscription = this.cs.getCompras().subscribe((res: any) => {
      this.compras = res;
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

  colorEstado(estadoPago: number | any): string {

    if (estadoPago == 1)
      return 'text-success h6';
    else 
      return 'text-warning h6';
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
    this.comprasGetSubscription.unsubscribe();
    if (this.compraGetSubscription != null || this.compraGetSubscription != undefined) {
      this.compraGetSubscription.unsubscribe();
      //console.log('se elimino el get edit')
    }

    if (this.compraPostSubscription != null || this.compraPostSubscription != undefined) {
      this.compraPostSubscription.unsubscribe();
      //console.log('se elimino el post')
    }

    if (this.compraPutSubscription != null || this.compraPutSubscription != undefined) {
      this.compraPutSubscription.unsubscribe();
      //console.log('se elimino el put')
    }

    if (this.compraDeteleSubscription != null || this.compraDeteleSubscription != undefined) {
      this.compraDeteleSubscription.unsubscribe();
      //console.log('se elimino el delete')
    }
    //console.log('ngOnDestroy iniciado');
  }

}
