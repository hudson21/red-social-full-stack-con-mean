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
  public identity;
  public token;
  
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

  signup(user: User, gettoken = null): Observable<any>{
    if(gettoken != null){
        user.gettoken = gettoken;
    }
    
    let params = JSON.stringify(user);//Convertir el objeto a un String de JSON
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url+'login',params, {headers:headers });
  }

  getIdentity(){
    //El parse convierte un JSON string a un objeto de javascript
    let identity = JSON.parse(localStorage.getItem('identity')); 

    if(identity != 'undefined'){
        this.identity = identity;
    }else{
        this.identity = null;
    }
    
    return this.identity;
  }

  getToken(){
    let token = localStorage.getItem('token');
    
    if(token != 'undefined'){
        this.token = token;
    }else{
        this.token = null;
    }

    return this.token;
  }
  
}
