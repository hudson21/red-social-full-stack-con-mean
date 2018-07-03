import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public titleLogin:string;

  constructor() {
    this.titleLogin = 'Identificate';
   }

  ngOnInit() {
    console.log('Componente de login cargado :)');
  }

}
