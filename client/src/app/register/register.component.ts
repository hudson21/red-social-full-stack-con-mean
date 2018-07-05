import { Component, OnInit } from '@angular/core';
//Importar módulos
import { Router, ActivatedRoute, Params } from '@angular/router';
//Importar modelos
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[ UserService]//Dentro de ella cargar los servicios en esta clase
})
export class RegisterComponent implements OnInit {

  public title:string;
  public user: User;//Va a ser un objeto de tipo usuario
  public status:string;
  constructor(
      private _route: ActivatedRoute,
      private _router:Router,
      private _userService: UserService
  ) {
    this.title = 'Registrate';
    this.user = new User( "","","","","","","ROLE_USER","", "");
   }

  ngOnInit() {
    console.log('Componente de register cargado :)');
  }

  onSubmit(registerForm){
    //Por el Observable puedo utilizar sus callbacks como (subscribe)
    this._userService.register(this.user).subscribe(
      response =>{
        if(response.user && response.user._id){
            //console.log(response.user);
            this.status = 'success';
            //Inicializar el formulario
            registerForm.reset();//Esto es un método que tienen los formularios para ser reseteados
        }else{
          this.status = 'error';
        } 
      },
      error =>{
        console.log(<any>error);
      }
    );
  }

}
