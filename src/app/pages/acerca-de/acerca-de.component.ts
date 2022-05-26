import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.css']
})
export class AcercaDeComponent implements OnInit {
  ubicacionImagen: string = '../../../assets/img/acerca_de/img1.jpg';

  constructor() { }

  ngOnInit(): void {
  }

}
