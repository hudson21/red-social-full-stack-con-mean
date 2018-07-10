import { Component, OnInit, DoCheck } from '@angular/core';

@Component({
    selector: 'sent',
    templateUrl: './sent.component.html',
    styleUrls: ['./sent.component.css']
})
export class SentComponent implements OnInit{

    public title:string;

    constructor(

    ){
        this.title = 'Mensajes enviados';
    }

    ngOnInit(){
        console.log('sent.component.ts se ha cargado con éxito :)')
    }
}