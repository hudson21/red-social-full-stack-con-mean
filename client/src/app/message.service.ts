import { Injectable } from '@angular/core';
//Esto es para poder hacer las peticiones ajax
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { GLOBAL } from './global';
import { Message } from './models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public url:string;

  constructor(private _http: HttpClient) { 
    this.url = GLOBAL.url;
  }

  addMessage(token, message) :Observable<any>{
    let params = JSON.stringify(message);
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', token);
    //Hacer la petición por POST
    return this._http.post(this.url+'message', params, {headers: headers});
  }

  getReceivedMessages(token, page = 1) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', token);
    //Haces la petición por GET
    return this._http.get(this.url+'my-messages/'+page, {headers: headers});
  }

  getEmittedMessages(token, page = 1) :Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', token);
    //Haces la petición por GET
    return this._http.get(this.url+'messages/'+page, {headers: headers});
  }
}
