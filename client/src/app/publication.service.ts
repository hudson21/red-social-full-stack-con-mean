import { Injectable } from '@angular/core';
//Esto es para poder hacer las peticiones ajax
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { GLOBAL } from './global';
import { Publication } from './models/publication';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {

  public url:string;

  constructor(
    private _http: HttpClient
  ) { 
    this.url = GLOBAL.url;
  }

  addPublication(token, publication): Observable<any>{
      let params = JSON.stringify(publication);
      let headers = new HttpHeaders().set('Content-Type','application/json')
                                     .set('Authorization', token);
      //Hacer la petición por POST
      return this._http.post(this.url + 'publication', params, {headers: headers});
  }

  getPublications(token, page = 1): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json')
                                   .set('Authorization', token);
    //Hacer la petición por GET
    return this._http.get(this.url + 'publications/'+page, {headers: headers});
  }

  getPublicationsUser(token, user_id, page = 1): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json')
                                   .set('Authorization', token);
    //Hacer la petición por GET
    return this._http.get(this.url + 'publications-user/'+user_id+'/'+page, {headers: headers});
  }

  deletePublication(token, publication_id): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json')
                                   .set('Authorization', token);
    //Hacer la petición por DELETE
    return this._http.delete(this.url + 'publication/'+ publication_id, {headers: headers});
  } 
}
