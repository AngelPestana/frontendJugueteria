import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

  formulario: any;
  dtOptions: DataTables.Settings = {};
  administradores: Administrador[] = [];
  administrador: Administrador[] = [];
  dtTrigger: Subject<any> = new Subject<any>();
  administradoresGetSubscription: Subscription | any;
  administradorGetSubscription: Subscription | any;
  administradorPostSubscription: Subscription | any;
  administradorPutSubscription: Subscription | any;
  administradorDeteleSubscription: Subscription | any;
  estaEnGestion: boolean = false;

  constructor(private spinner: NgxSpinnerService, private as: AdministradorService, private router: Router) { }

  ngOnInit(): void {
    this.formularioReactivo();
    this.iniciarTabla();
  }

  formularioReactivo(): void {
    this.formulario = new FormGroup({
      nombre: new FormControl('', [
        Validators.required, 
        Validators.minLength(3),
        Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,48}")
      ]),
      apellidos: new FormControl('', [
        Validators.required, 
        Validators.minLength(3),
        Validators.pattern("[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,64}")
      ]),
      correo: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
        Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
      ]),
      contrasenia: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        Validators.pattern("[A-Za-z0-9!?-]{8,12}")
      ]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("[0-9]{3}[0-9]{3}[0-9]{2}[0-9]{2}")
      ])
    });
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
    this.estaEnGestion = false;
    this.formulario.reset();//vaciamos el formulario
  }

  entroEnGestion(id: number | undefined) {
    this.estaEnGestion = true;
    this.formulario.reset();//vaciamos el formulario
    this.spinner.show();//Mostramos el loading
    this.administradorGetSubscription = this.as.getAdministrador(id).subscribe((res: any) => {
      //dentro del subscribe estaran los datos consultados de la api, fuera de este no tendras nada
      this.administrador = res;
      //console.log(this.administrador);
      this.presentandoDatos();
    });
  }

  presentandoDatos() {
    this.formulario.patchValue({
      nombre: this.administrador['nombre'],
      apellidos: this.administrador['apellidos'],
      correo: this.administrador['correo'],
      telefono: this.administrador['telefono']
    });
    console.log(this.formulario.controls.contrasenia.status);
    this.cerrarLoading();
  }

  validacionEdicion():string {
    if ((this.formulario.controls.contrasenia.status === 'INVALID' || this.formulario.controls.contrasenia.status === 'VALID') && this.formulario.controls.nombre.status === 'VALID' && this.formulario.controls.apellidos.status === 'VALID' && this.formulario.controls.correo.status === 'VALID' && this.formulario.controls.telefono.status === 'VALID') {
      return '';
    }
    return 'disabled';
  }

  cerrarLoading(): void {
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
  }

  editarProducto() {
    this.spinner.show();//Mostramos el loading
    let administrador = new Administrador();
    administrador.nombre = this.formulario.value.nombre;
    administrador.apellidos = this.formulario.value.apellidos;
    if (this.formulario.value.correo != this.administrador['correo']) {
      administrador.correo = this.formulario.value.correo;
    }
    administrador.contraseña = this.formulario.value.contrasenia;
    administrador.telefono = this.formulario.value.telefono;
    this.administradorPutSubscription = this.as.putAdministrador(administrador, this.administrador['id']).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se editó el administrador con exito!!';
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
    this.administradorDeteleSubscription = this.as.deleteAdministrador(this.administrador['id']).subscribe((res: any) => {
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
    let administrador = new Administrador();
    administrador.nombre = this.formulario.value.nombre;
    administrador.apellidos = this.formulario.value.apellidos;
    administrador.correo = this.formulario.value.correo;
    administrador.contraseña = this.formulario.value.contrasenia;
    administrador.telefono = this.formulario.value.telefono;
    this.administradorPostSubscription = this.as.postAdministrador(administrador).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se agregó el administrador con exito!!';
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

  get formularioControl() {//NO borrar
    return this.formulario.controls;
  }

}
