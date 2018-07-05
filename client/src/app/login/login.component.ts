import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[ UserService ] //Voy a cargar mi servicio en los providers
})
export class LoginComponent implements OnInit {
  public titleLogin:string;
  public user:User;
  public status:string;
  public identity;//Va llevar un objeto del usuario identificado
  public token;//Va a llevar el token del ususario logueado

  constructor(
      private _route: ActivatedRoute,
      private _router: Router,
      private _userService: UserService
  ) {
    this.titleLogin = 'Identificate';
    this.user = new User( "","","","","","","ROLE_USER","","");//Inicializamos el objeto de User
   }

  ngOnInit() {
    console.log('Componente de login cargado :)');
  }

  onSubmit(){
    //Loguear al usuarios y conseguir sus datos
    this._userService.signup(this.user).subscribe(
        response =>{
            this.identity = response.user;
            console.log(this.identity);

            if(!this.identity || !this.identity._id){
                this.status = 'error';
            }else{
              this.status = 'success';
              //Guardar datos del usuario en el localStorage
              localStorage.setItem('identity', JSON.stringify(this.identity));

              //Conseguir el token
              this.getToken();
            } 
            this.status = 'success';
        },
        error =>{
            var errorMessage = <any>error;
            console.log(errorMessage);
            if(errorMessage != null){
                this.status = 'error';
            }
        }
    );
  }

  getToken(){
    this._userService.signup(this.user,'true').subscribe(
      response =>{
          this.token = response.token;
          
          if(this.token.length <= 0){
              this.status = 'error';
          }else{
            this.status = 'success';
            console.log(this.token);
            //Persistir el token del usuario (localStorage)
            localStorage.setItem('token', this.token);
            
            //Conseguir los contadores o estadísticas del usuario

          
          }
      },
      error =>{
          var errorMessage = <any>error;
          console.log(errorMessage);
          if(errorMessage != null){
              this.status = 'error';
          }
      }
    );
  
  }

}
