import { Component, OnInit } from '@angular/core';
import { Details } from 'src/app/models/Details';
import { Producto } from 'src/app/models/Producto';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {

  urlBase = 'http://localhost:8080/api/productos/vehiculos';
  url = 'http://localhost:8080/api/productos/vehiculos';
  rutaImagenes = 'http://localhost/jugueteria/public/images/productos/';
  productos: Producto[] = [];
  producto: Producto[] = [];
  details: Details | any;//por objeto
  numbers: number[] = []
  constructor(private ps: ProductoService) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.ps.getProductosCategoriaVehiculos(this.url).subscribe((res: any) => {
      this.productos = res.productos;
      this.details = res.getDetails;
      //console.log(this.productos);
      //console.log(this.details);
      //console.log('siguiente: ' + this.details.next);
      //console.log('anterior: ' + this.details.previous);
      this.contar();
    });
  }

  contar() {
    this.numbers = [];
    for (let i = 1; i <= this.details.pageCount; i++) {
      this.numbers.push(i);
    }
  }

  mostrarOtrosProductos(otroUrl: string) {
    //console.log(otroUrl);
    this.url = otroUrl;
    this.obtenerProductos();
  }

}
