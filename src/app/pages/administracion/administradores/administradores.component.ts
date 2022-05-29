import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { Administrador } from 'src/app/models/Administrador';
import { AdministradorService } from 'src/app/services/administrador.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-administradores',
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css']
})
export class AdministradoresComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  administradores: Administrador[] = [];
  administrador: Administrador[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  administradoresGetSubscription: Subscription | any;
  administradorGetSubscription: Subscription | any;
  administradorPostSubscription: Subscription | any;
  administradorPutSubscription: Subscription | any;
  administradorDeteleSubscription: Subscription | any;

  constructor(private spinner: NgxSpinnerService, private as: AdministradorService, private router: Router) { }

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
    this.obtenerAdministradores();
  }

  obtenerAdministradores() {
    this.spinner.show();//Mostramos el loading
    this.administradoresGetSubscription = this.as.getAdministradores().subscribe((res: any) => {
      this.administradores = res;
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
    this.administradoresGetSubscription.unsubscribe();
    if (this.administradorGetSubscription != null || this.administradorGetSubscription != undefined) {
      this.administradorGetSubscription.unsubscribe();
      //console.log('se elimino el get edit')
    }

    if (this.administradorPostSubscription != null || this.administradorPostSubscription != undefined) {
      this.administradorPostSubscription.unsubscribe();
      //console.log('se elimino el post')
    }

    if (this.administradorPutSubscription != null || this.administradorPutSubscription != undefined) {
      this.administradorPutSubscription.unsubscribe();
      //console.log('se elimino el put')
    }

    if (this.administradorDeteleSubscription != null || this.administradorDeteleSubscription != undefined) {
      this.administradorDeteleSubscription.unsubscribe();
      //console.log('se elimino el delete')
    }
    //console.log('ngOnDestroy iniciado');
  }

}
