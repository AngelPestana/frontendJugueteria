import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  clientes: Cliente[] = [];
  cliente: Cliente[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  clientesGetSubscription: Subscription | any;
  clienteGetSubscription: Subscription | any;
  clientePostSubscription: Subscription | any;
  clientePutSubscription: Subscription | any;
  clienteDeteleSubscription: Subscription | any;

  constructor(private spinner: NgxSpinnerService, private cs: ClienteService, private router: Router) { }

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
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.spinner.show();//Mostramos el loading
    this.clientesGetSubscription = this.cs.getClientes().subscribe((res: any) => {
      this.clientes = res;
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
    this.clientesGetSubscription.unsubscribe();
    if (this.clienteGetSubscription != null || this.clienteGetSubscription != undefined) {
      this.clienteGetSubscription.unsubscribe();
      //console.log('se elimino el get edit')
    }

    if (this.clientePostSubscription != null || this.clientePostSubscription != undefined) {
      this.clientePostSubscription.unsubscribe();
      //console.log('se elimino el post')
    }

    if (this.clientePutSubscription != null || this.clientePutSubscription != undefined) {
      this.clientePutSubscription.unsubscribe();
      //console.log('se elimino el put')
    }

    if (this.clienteDeteleSubscription != null || this.clienteDeteleSubscription != undefined) {
      this.clienteDeteleSubscription.unsubscribe();
      //console.log('se elimino el delete')
    }
    //console.log('ngOnDestroy iniciado');
  }

}
