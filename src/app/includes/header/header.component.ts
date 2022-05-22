import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  ubicacionLogo: string = '../../../assets/img/logo/coppel2.png';

  constructor() { }

  ngOnInit(): void {
  }

}
