import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { GLOBAL } from '../global';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [ UserService]
})
export class UsersComponent implements OnInit {
  
  public title: string;
  public url: string;
  public identity;
  public token;
  public page;
  public next_page;
  public prev_page;
  public total;
  public pages;
  public users: User[];
  public follows;
  public status: string;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService
  ) { 
    this.title = 'Usuarios';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    console.log("Cargado con éxito el users.component.ts :)");
    this.actualPage();
  }

  //Coger la página actual en la que estamos
  actualPage(){
    this._route.params.subscribe(params =>{
        let page = +params['page'];//Recoger el parámetro page y convertirlo a entero con el +
        this.page = page;

        //Comprobar si el parámetro page existe en la url
        if(!params['page']){
            page = 1;//Para que no nos salga la variable de undefined en la URL
        }

        if(!page){
            page = 1;
        }else{
            this.next_page = page + 1;
            this.prev_page = page - 1;

            if(this.prev_page <= 0){
                this.prev_page = 1;
            }
        }

        //Devolver listado de los usuarios
        this.getUsers(page);
    });
  }

  getUsers(page){
      this._userService.getUsers(page).subscribe(
        response =>{
          if(!response.users){
              this.status = 'error';
          }else{
              this.total = response.total;
              this.users = response.users;
              this.pages = response.pages;
              this.follows = response.users_following;

              console.log(this.follows);

              if(page > this.pages){
                  //Si es la última página que me redirija a la página 1 de los usuarios
                  this._router.navigate(['/usuarios',1]);
              }

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
