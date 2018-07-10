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
  public stats;
  public statsUser;
  
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

  signup(user, gettoken = null): Observable<any>{
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

  getStats(){
    let stats = JSON.parse(localStorage.getItem('stats'));

    if(stats != 'undefined'){
        this.stats = stats;
    }else{
        this.stats = null;
    }

    return this.stats;
  }

  getStatsUser(){
    let statsUser = JSON.parse(localStorage.getItem('statsUser'));

    if(statsUser != 'undefined'){
        this.statsUser = statsUser;
    }else{
        this.statsUser = null;
    }

    return this.statsUser;
  }

  getCounters(userId = null):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization',this.getToken());
    if(userId != null){
       return this._http.get(this.url+'counters/'+userId, {headers: headers});
    }else{
      return this._http.get(this.url+'counters/', {headers: headers});
    }
  }

  getCountersWithoutURL():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization',this.getToken());
  
    return this._http.get(this.url+'counters/', {headers: headers});
    
  }

  updateUser(user:User):Observable<any>{
    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type','application/json')
                                   .set('Authorization',this.getToken());

    //Método para actualizar la información del usuario con PUT
    return this._http.put(this.url+'update-user/'+user._id, params, {headers: headers});
  }

  getUsers(page = null): Observable<any>{
      let headers = new HttpHeaders().set('Content-Type','application/json')
                                     .set('Authorization', this.getToken());
      //Hacer una petición por GET
      return this._http.get(this.url + 'users/'+ page, {headers: headers});
  }

  getUser(id_user): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json')
                                   .set('Authorization', this.getToken());
    //Hacer una petición por GET
    return this._http.get(this.url + 'user/'+ id_user, {headers: headers});
}

  
}
