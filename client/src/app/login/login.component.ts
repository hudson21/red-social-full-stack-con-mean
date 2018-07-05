import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[ UserService ]
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
