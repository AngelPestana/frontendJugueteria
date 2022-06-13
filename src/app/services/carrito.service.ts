import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Producto } from '../models/Producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private contador: number = 0;
  private productos: Producto [] = [];
  private enviarContadorSubject = new Subject<number>();
  public enviarContadorObservable = this.enviarContadorSubject.asObservable();

  constructor() { }

  enviarContador(contador: number) {
    this.enviarContadorSubject.next(contador);
    //this.contador = contador;
  }

  agregarProducto(producto: Producto) {
    this.productos.push(producto);
    this.contador++;
    this.enviarContador(this.contador);
  }

  eliminarProducto(producto: Producto) {
    this.productos.splice(this.productos.indexOf(producto), 1);
    this.contador--;
    this.enviarContador(this.contador);
  }

  obtenerProductos() {
    return this.productos;
  }

  obtenerContador() {
    return this.contador;
  }

  vaciarCarrito() {
    this.productos = [];
    this.contador = 0;
    this.enviarContador(this.contador);
  }

  obtenerProducto(id: number) {
    return this.productos[id];
  }

}
