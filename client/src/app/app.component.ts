import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './user.service'; 
import { GLOBAL } from './global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck{
 public title:string;
 public identity;
 public url:string;
 
 constructor(
   private _userService: UserService,
   private _route: ActivatedRoute,
   private _router: Router
 ){
   this.title  = 'NGSOCIAL';
   this.url = GLOBAL.url;
 }

 ngOnInit(){
    this.identity = this._userService.getIdentity();
 }

 //El ngDoCheck me sirve para poder refrescar en tiempo real las variables de mi aplicación
 ngDoCheck(){
   this.identity = this._userService.getIdentity();
 }

 logout(){
   localStorage.clear();
   this.identity = null;
   this._router.navigate(['/']);
 }

}
