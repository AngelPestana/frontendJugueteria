import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css']
})
export class BeneficiosComponent implements OnInit {
  ubicacionImagen: string = '../../../assets/img/beneficios/img1.jpg';

  constructor() { }

  ngOnInit(): void {
  }

}
