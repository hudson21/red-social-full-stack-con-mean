import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FollowService } from '../../../follow.service';
import { GLOBAL } from '../../../global';
import { Follow } from '../../../models/follow';
import { Message } from '../../../models/message';
import { MessageService } from '../../../message.service';
import { UserService } from '../../../user.service';

@Component({
    selector: 'add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.css'],
    providers: [FollowService, MessageService]
})
export class AddComponent implements OnInit{

    public title:string;
    public url:string;
    public message:Message;
    public identity;
    public token;
    public status:string;
    public follows;

    constructor(
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService,
        private _router: Router,
        private _route: ActivatedRoute
    ){
        this.title = 'Enviar mensaje';
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.message = new Message('','','','',this.identity._id,'');
    }

    ngOnInit(){
        console.log('add.component.ts se ha cargado con éxito :)');
        this.getMyFollows();
    }

    onSubmit(form){
        //console.log(this.message);
        this._messageService.addMessage(this.token, this.message).subscribe(
            response =>{
                if(response.message){
                    this.status = 'success';
                    form.reset();//Resetear los parámetros del formulario
                }
            },  
            error =>{
                this.status = 'error';
                console.log(<any>error);
            }
        );
    }

    getMyFollows(){
        this._followService.getMyFollows(this.token).subscribe(
            response =>{
                //console.log(response.follows);
                this.follows = response.follows;
            },
            error =>{
                console.log(<any>error);
            }
        );
    }
}