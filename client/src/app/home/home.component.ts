import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public title:string;

  constructor() {
    this.title = "Bienvenido a NGSocial";
   }

  ngOnInit() {
    //console.log('El componente de la home se ha cargado');
  }

}
