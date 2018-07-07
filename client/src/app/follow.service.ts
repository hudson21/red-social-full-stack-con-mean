import { Injectable } from '@angular/core';
//Esto es para poder hacer las peticiones ajax
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { GLOBAL } from './global';
import { User } from './models/user';
import { Follow } from './models/follow';


@Injectable({
  providedIn: 'root'
})
export class FollowService {

  public url:string;

  constructor(
    private _http: HttpClient,

  ) { 
    this.url = GLOBAL.url;
  }

  addFollow(token, follow):Observable<any>{
    let params = JSON.stringify(follow);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', token);
    //Hacer la petición por POST
    return this._http.post(this.url+'follow', params, {headers: headers});
  }

  deleteFollow(token, id_user):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', token);
    //Hacer la petición a la API por DELETE
    return this._http.delete(this.url + 'follow/' + id_user, {headers: headers});
  }


}
