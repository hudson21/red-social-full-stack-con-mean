import { Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { UserService } from '../user.service';
import { GLOBAL } from '../global';
import { Publication } from '../models/publication';
import { PublicationService } from '../publication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers:[ UserService, PublicationService]
})
export class SidebarComponent implements OnInit {

  public url:string;
  public token;
  public stats;
  public status;
  public identity;
  public publication: Publication;

  constructor(
    private _userService : UserService,
    private _publicationService: PublicationService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.publication = new Publication("","","","",this.identity._id);
   }

  ngOnInit() {
    console.log("Cargado exitosamente el sidebar.component.ts :)");
  }

  onSubmit(newPubForm){
    //console.log(this.publication);
    this._publicationService.addPublication(this.token, this.publication).subscribe(
      response =>{
        if(response.publication){
          //this.publication = response.publication;
          this.status = 'success';
          newPubForm.reset();//Reseteo el formulario y lo vacío 
          this._router.navigate(['/timeline']);
        }else{
          this.status = 'error';
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage != null){
          this.status = 'error';
        }
      }
    );
  }


  //Output
  @Output() sent = new EventEmitter();//Esta propiedad va a poder emitir eventos
  sendPublication(event){
    //console.log(event);
    this.sent.emit({send:'true'}) //Emito el evento
  }


}
