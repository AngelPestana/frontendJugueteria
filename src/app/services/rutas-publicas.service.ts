import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/Cliente';
import { Login } from '../models/Login';

@Injectable({
  providedIn: 'root'
})
export class RutasPublicasService {

  url: string = 'http://localhost:8080/auth/';
  url2: string = 'http://localhost:8080/registroCliente/';

  constructor(private http: HttpClient) { }

  postLogin(login: Login): Observable<Login> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Login>(this.url + 'login', login, httpOptions);
  }

  postCliente(cliente: Cliente): Observable<Cliente> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post<Cliente>(this.url + 'create', cliente, httpOptions);
  }


}
