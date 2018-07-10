import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';
import { FollowService } from '../follow.service';
import { GLOBAL } from '../global';
import { Follow } from '../models/follow';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
  providers: [ UserService, FollowService]
})
export class FollowingComponent implements OnInit, DoCheck {

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
  public following;
  public status: string;
  public stats;
  public statsUser;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = 'Usuarios';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
   }

   ngOnInit() {
    console.log("Cargado con éxito el users.component.ts :)");
    this.actualPage();
    this.stats = this._userService.getStats();
    this.statsUser = this._userService.getStatsUser();
  }

  ngDoCheck(){
    this.stats = this._userService.getStats();
    this.statsUser = this._userService.getStatsUser();
  }

  //Coger la página actual en la que estamos
  actualPage(){
    this._route.params.subscribe(params =>{
        //Recogemos el id del usuario
        let user_id = params['id'];

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
        this.getFollows(user_id,page);
    });
  }

  getFollows(user_id, page){
      this._followService.getFollowing(this.token, user_id, page).subscribe(
        response =>{
          if(!response.follows){
              this.status = 'error';
          }else{
              console.log(response);
              /*this.total = response.total;
              this.users = response.users;
              this.pages = response.pages;
              //Esta es la variable que voy a examinar en la vista para saber si sigo al usuario o no
              this.follows = response.users_following;

              //console.log(this.follows);

              if(page > this.pages){
                  //Si es la última página que me redirija a la página 1 de los usuarios
                  this._router.navigate(['/usuarios',1]);
              }*/

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

  public followUserOver;
  mouseEnter(user_id){
    this.followUserOver = user_id;
  }

  mouseLeave(user_id){
    //Lo dejo a 0 para poder tomar el _id de algún otro usuario al que quiera seguir
    this.followUserOver = 0;
  }

  followUser(followed){
    var follow = new Follow('',this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(
      response =>{
        if(!response.follow){
          this.status = 'error';
        }else{
          this.status = 'success';
          this.follows.push(followed);//Añadimos un nuevo id al array;
          this.getCounters();

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

  unfollowUser(followed){
    this._followService.deleteFollow(this.token, followed).subscribe(
      response =>{
        //Recoger el _id de usuario y borrarlo del array de follows
        var search = this.follows.indexOf(followed);//Búscame followed en el array de follows
        //El resultado de indexOf es -1 cuando no encuentra el valor seleccionado en el array
        if(search != -1){
          //Utilizamos splice para eliminar el valor que encontró con el indexOf
          this.follows.splice(search, 1);//El uno es para que solo elimine un solo elemento a partir de ese
          this.getCounters();
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

  getCounters(){
    this._userService.getCountersWithoutURL().subscribe(
        response =>{
          localStorage.setItem('statsUser',JSON.stringify(response));
        },
        error =>{
            console.log(<any>error);
        }
    );
  }

}
