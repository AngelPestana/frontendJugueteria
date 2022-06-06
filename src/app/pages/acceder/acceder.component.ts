import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Login } from 'src/app/models/Login';
import { RutasPublicasService } from 'src/app/services/rutas-publicas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acceder',
  templateUrl: './acceder.component.html',
  styleUrls: ['./acceder.component.css']
})
export class AccederComponent implements OnInit {
  formulario: any;

  constructor(private spinner: NgxSpinnerService, private rps: RutasPublicasService, private router: Router) { }

  ngOnInit(): void {
    this.formularioReactivo();
  }

  formularioReactivo(): void {
    this.formulario = new FormGroup({
      correo: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
        Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
      ]),
      contrasenia: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
        Validators.pattern("[A-Za-z0-9!?-]{8,12}")
      ])
    });
    //console.log(this.formulario);
  }

  entrar(): void {
    //console.log('entrar');
    this.spinner.show();//Mostramos el loading
    let correo = this.formulario.value.correo;
    let contrasenia = this.formulario.value.contrasenia;
    let login = new Login();
    login.correo = correo;
    login.contraseña = contrasenia;
    //console.log(login);
    //this.cerrarLoading();
    
    this.rps.postLogin(login).subscribe((res: any) => {
      //console.log(res);
      localStorage.setItem('token', res.Token);
      localStorage.setItem('id', res.user.id);
      localStorage.setItem('nombre', res.user.nombre);
      localStorage.setItem('apellidos', res.user.apellidos);
      localStorage.setItem('idRol', res.user.idRol);
      let date = new Date();
      let time = date.getTime();
      //Recordar que son milisegundos por eso multiplicamos por 1000
      let time2 = time + (((12 * 60 * 60)*1000) - 10000);
      localStorage.setItem('tiempoExpirado', time2.toString());
      //console.log(time2);
      this.cerrarLoading();
      this.mensajeInicioSesion();
      this.router.navigate(['/home']);
    }, (error: any) => {
      //console.log(error.error.messages.error);
      this.cerrarLoading();
      this.mensajeErrorIniciarSesion(error.error.messages.error);
    });
  }

  mensajeInicioSesion() {
    Swal.fire({
      icon: 'success',
      title: '¡Bienvenid@ ' + localStorage.getItem('nombre') + ' a Coppel Juguetería!',
    })
  }

  mensajeErrorIniciarSesion(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: mensaje
    })
  }

  cerrarLoading(): void {
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
  }

  get formularioControl() {//NO borrar
    return this.formulario.controls;
  }

}
