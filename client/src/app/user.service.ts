import { Injectable } from '@angular/core';
//Esto es para poder hacer las peticiones ajax
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { GLOBAL } from './global';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url: string;
  
  constructor(public _http:HttpClient) {
    this.url = GLOBAL.url;
  }

  //Este es el resultado que nos va a devolver después de que nos registremos
  register(user: User):Observable<any>{//Este método va a devolver un observable
    let params = JSON.stringify(user);//Convertirlo a un JSON en formato String

    //Configurar las cabeceras
    let headers = new HttpHeaders().set('Content-Type','application/json');
    //Hacer la petición al API
    return this._http.post(this.url+'register', params, {headers:headers});
  }

}
