import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Publication } from '../models/publication';
import { UserService } from '../user.service';
import { PublicationService } from '../publication.service';
import { GLOBAL } from '../global';
import { User } from '../models/user';
import * as $ from 'jquery';// import Jquery here

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css'],
  providers:[ UserService, PublicationService]
})
export class PublicationsComponent implements OnInit {

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
  public noMore;

  @Input() user: string;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _publicationService: PublicationService
  ) { 
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.title = 'Publicaciones';
    this.page = 1;
    this.noMore = false;
  }

  ngOnInit() {
    console.log('Cargado exitosamente el publications.component.ts :)');
    this.getPublications(this.user, this.page);
    
  }

  getPublications(user, page, adding = false){
    this._publicationService.getPublicationsUser(this.token, user, page).subscribe(
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

  viewMore(){
    this.page += 1;
    if(this.page == this.pages){
        this.noMore = true;
    }
    this.getPublications(this.user, this.page, true);
}

}
