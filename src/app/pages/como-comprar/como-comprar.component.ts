import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-como-comprar',
  templateUrl: './como-comprar.component.html',
  styleUrls: ['./como-comprar.component.css']
})
export class ComoComprarComponent implements OnInit {
  ubicacionImagen: string = '../../../assets/img/pasos_comprar/img1.jpg';

  constructor() { }

  ngOnInit(): void {
  }

}
