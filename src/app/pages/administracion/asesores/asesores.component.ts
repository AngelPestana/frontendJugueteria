import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { Asesor } from 'src/app/models/Asesor';
import { AsesorService } from 'src/app/services/asesor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asesores',
  templateUrl: './asesores.component.html',
  styleUrls: ['./asesores.component.css']
})
export class AsesoresComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  asesores: Asesor[] = [];
  asesor: Asesor[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  asesoresGetSubscription: Subscription | any;
  asesorGetSubscription: Subscription | any;
  asesorPostSubscription: Subscription | any;
  asesorPutSubscription: Subscription | any;
  asesorDeteleSubscription: Subscription | any;
  paginacion: any;

  constructor(private spinner: NgxSpinnerService, private as: AsesorService, private router: Router) { }

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
    this.obtenerAsesores();
    this.obtenerAsesores2();
  }

  obtenerAsesores() {
    this.spinner.show();//Mostramos el loading
    this.asesoresGetSubscription = this.as.getAsesores().subscribe((res: any) => {
      this.asesores = res;
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

  obtenerAsesores2() {
    this.asesoresGetSubscription = this.as.getAsesores2().subscribe((res: any) => {
      console.log(res);
      //this.paginacion = res.pager;
    }, (error => {
      console.log(error);
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
    this.asesoresGetSubscription.unsubscribe();
    if (this.asesorGetSubscription != null || this.asesorGetSubscription != undefined) {
      this.asesorGetSubscription.unsubscribe();
      //console.log('se elimino el get edit')
    }

    if (this.asesorPostSubscription != null || this.asesorPostSubscription != undefined) {
      this.asesorPostSubscription.unsubscribe();
      //console.log('se elimino el post')
    }

    if (this.asesorPutSubscription != null || this.asesorPutSubscription != undefined) {
      this.asesorPutSubscription.unsubscribe();
      //console.log('se elimino el put')
    }

    if (this.asesorDeteleSubscription != null || this.asesorDeteleSubscription != undefined) {
      this.asesorDeteleSubscription.unsubscribe();
      //console.log('se elimino el delete')
    }
    //console.log('ngOnDestroy iniciado');
  }

}
