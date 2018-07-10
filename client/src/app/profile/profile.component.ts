import { Component, OnInit, DoCheck } from '@angular/core';
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
export class ProfileComponent implements OnInit, DoCheck {

  public url:string;
  public title:string;
  public status:string;
  public identity;
  public token;
  public stats;
  public statsUser;
  public followed;
  public following;
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
    this.followed = false;
    this.following = false;
    //
  }

  ngOnInit() {
    //console.log('profile.component.ts cargado exitosamente :)');
    this.loadPage();
    this.stats = this._userService.getStats();
    this.statsUser = this._userService.getStatsUser();
  }

  ngDoCheck(){
    this.statsUser = this._userService.getStatsUser();
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

          //Si hay un id dentro del campo de following
          if(response.following && response.following._id){
            this.following = true;
          }else{
            this.following = false;
          }

          //Si hay un id dentro del campo de followed
          if(response.followed && response.followed._id){
            this.followed = true;
          }else{
            this.followed = false;
          }

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
          localStorage.setItem('stats',JSON.stringify(this.stats));
        },
        error =>{
          console.log(<any>error);
        }
      );
  }

  getCountersN(){
    this._userService.getCountersWithoutURL().subscribe(
        response =>{
          localStorage.setItem('statsUser',JSON.stringify(response));
        },
        error =>{
            console.log(<any>error);
        }
    );
  }

  followUser(followed){
    var follow = new Follow('', this.identity._id,followed);

    this._followService.addFollow(this.token, follow).subscribe(
      response =>{
        this.following = true;
        this.getCountersN();
      },
      error =>{
        console.log(<any>error);
      }
    );
  }

  unfollowUser(followed){
    this._followService.deleteFollow(this.token, followed).subscribe(
      response =>{
        this.following = false;
        this.getCountersN();
      }, 
      error =>{
        console.log(<any>error);
      }
    );
  }

  public followUserOver;
  mouseEnter(user_id){
    this.followUserOver = user_id;
  }

  mouseLeave(){
    this.followUserOver = 0;
  }

}
