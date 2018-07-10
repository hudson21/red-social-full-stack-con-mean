import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../models/publication';
import { UserService } from '../user.service';
import { PublicationService } from '../publication.service';
import { GLOBAL } from '../global';
import { User } from '../models/user';
import * as $ from 'jquery';// import Jquery here

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers:[ UserService, PublicationService]
})
export class TimelineComponent implements OnInit, DoCheck {

  public url :string;
  public identity;
  public token;
  public title:string;
  public status:string;
  public page;
  public total;
  public pages;
  public itemsPerPage;
  public publications: Publication[];
  public showImage;
  public statsUser;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) { 
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.title = 'Timeline';
    this.page = 1;
  }

  ngOnInit() {
    //console.log('Cargado exitosamente el timeline.component.ts :)');
    this.getPublications(this.page);
    this.statsUser = this._userService.getStatsUser();
  }

  ngDoCheck(){
    this.statsUser = this._userService.getStatsUser();
  }

  getPublications(page, adding = false){
    this._publicationService.getPublications(this.token, page).subscribe(
      response =>{
        if(response.publications){
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;

          if(!adding){ //Si adding está en false
            this.publications = response.publications;
          }else{
            var arrayA = this.publications;
            var arrayB = response.publications;
            //Con el concat añado elementos a mi array (Concateno el contenido de arrayB en arrayA)
            this.publications = arrayA.concat(arrayB);

            $("html, body").animate({scrollTop: $('html').prop("scrollHeight")}, 500);
          }
        
          //Comprobar si la página actual > a this.pages
          if(page > this.pages){
            //this._router.navigate(['/home']);
          }
        }else{
          this.status = 'error';
        }
      },
      error =>{
        var errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage != null){
          this.status = 'error';
        }
      }
    );
  }
  
  public noMore = false;
  viewMore(){
    this.page += 1;
    if(this.page == this.pages){
        this.noMore = true;
    }
    this.getPublications(this.page, true);
  }

  refresh(event = null){
    //console.log(event);
    //Esto lo hago para que siempre me redirija a la página 1 y poder hacer el scroll
    this.getPublications(1);
    this.noMore = false;
  }

  showThisImage(publication_id){
    this.showImage = publication_id;
  }

  hideThisImage(publication_id){
    this.showImage = 0;
  }

  deletePublication(publication_id){
    this._publicationService.deletePublication(this.token,publication_id).subscribe(
      response =>{
        this.refresh();
        this.getCounters();
      },
      error =>{
        console.log(<any>error);
      }
    );
  }

  getCounters(){
    this._userService.getCountersWithoutURL().subscribe(
        response =>{
          localStorage.setItem('statsUser',JSON.stringify(response));
        },
        error =>{
            console.log(<any>error);
        }
    );
  }

}
