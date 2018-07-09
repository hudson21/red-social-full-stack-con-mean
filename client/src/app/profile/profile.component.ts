import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../models/user';
import { Follow } from '../models/follow';
import { FollowService } from '../follow.service';
import { GLOBAL } from '../global';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers:[UserService, FollowService]
})
export class ProfileComponent implements OnInit {

  public url:string;
  public title:string;
  public status:string;
  public identity;
  public token;
  public stats;
  public follow;
  public user:User;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _followService: FollowService
  ) { 
    this.url = GLOBAL.url;
    this.title = "Perfil";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
  }

  ngOnInit() {
    console.log('profile.component.ts cargado exitosamente :)');
    this.loadPage();
  }

  loadPage(){
    //Sacar los parámetros que me llegan por la URL
    this._route.params.subscribe(params =>{
       let id = params['id'];//Tomo el id del usuario a mostrar por la URL

       this.getUser(id);
       this.getCounters(id);
    });
  }

  getUser(user_id){
    this._userService.getUser(user_id).subscribe(
      response =>{
        if(response.user){
          //console.log(response);
          this.user = response.user;
        }else{
          this.status = 'error';
        }
      },
      error =>{
        var errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage != null){
          this.status = 'error';
        }
        this._router.navigate(['/perfil', this.identity._id]);
      }
    );
  }

  getCounters(user_id){
    this._userService.getCounters(user_id).subscribe(
      response =>{
        this.stats = response;
      },
      error =>{
        console.log(<any>error);
      }
    );
  }

}
