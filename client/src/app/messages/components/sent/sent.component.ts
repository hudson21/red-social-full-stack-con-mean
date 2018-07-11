import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FollowService } from '../../../follow.service';
import { GLOBAL } from '../../../global';
import { Follow } from '../../../models/follow';
import { Message } from '../../../models/message';
import { MessageService } from '../../../message.service';
import { UserService } from '../../../user.service';

@Component({
    selector: 'sent',
    templateUrl: './sent.component.html',
    styleUrls: ['./sent.component.css'],
    providers:[ UserService,MessageService, FollowService ]
})
export class SentComponent implements OnInit{

    public title:string;
    public url:string;
    public message:Message;
    public identity;
    public token;
    public status:string;
    public messages: Message[];//Array de objetos Message
    public pages;
    public page;
    public total;
    public next_page;
    public prev_page;

    constructor(
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService,
        private _router: Router,
        private _route: ActivatedRoute
    ){
        this.title = 'Mensajes enviados';
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.page = 1;
    }

    ngOnInit(){
        console.log('sent.component.ts se ha cargado con éxito :)');
        this.actualPage();
    }   

    actualPage(){
        this._route.params.subscribe(params =>{
            
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
    
            this.getMessages(this.token, this.page);
        });
      }

    getMessages(token, page){
        this._messageService.getEmittedMessages(token, page).subscribe(
            response =>{
                if(!response.messages){
                    
                }else{
                    //console.log(response);
                    this.messages = response.messages;
                    this.total = response.total;
                    this.pages = response.pages;
                }
            },
            error =>{
                console.log(<any>error);
            }
        );
    }
}