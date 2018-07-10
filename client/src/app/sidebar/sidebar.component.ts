import { Component, OnInit, EventEmitter, Input, Output, DoCheck} from '@angular/core';
import { UserService } from '../user.service';
import { GLOBAL } from '../global';
import { Publication } from '../models/publication';
import { PublicationService } from '../publication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UploadService } from '../upload.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers:[ UserService, PublicationService, UploadService]
})
export class SidebarComponent implements OnInit, DoCheck {

  public url:string;
  public token;
  public statsUser;
  public status;
  public identity;
  public publication: Publication;

  //Output
  @Output() sent = new EventEmitter();//Esta propiedad va a poder emitir eventos

  constructor(
    private _userService : UserService,
    private _publicationService: PublicationService,
    private _uploadService: UploadService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.publication = new Publication("","","","",this.identity._id);
   }

  ngOnInit() {
    //console.log("Cargado exitosamente el sidebar.component.ts :)");
    this.statsUser = this._userService.getStatsUser();
  }

  ngDoCheck(){
    this.statsUser = this._userService.getStatsUser();
  }

  onSubmit(newPubForm, $event){
    //console.log(this.publication);
    this._publicationService.addPublication(this.token, this.publication).subscribe(
      response =>{
        if(response.publication){
          //this.publication = response.publication;

          //Comprobar si hay imagen a subir en la publicación o no
          if(this.filesToUpload && this.filesToUpload.length){
          //Subir la Imagen
          this._uploadService.makeFileRequest(this.url + 'upload-image-pub/'
                                             +response.publication._id, [],
                                             this.filesToUpload, this.token, 'image')
                              .then((result:any) =>{
                                 this.publication.file = result.image;

                                 this.status = 'success';
                                 newPubForm.reset();//Reseteo el formulario y lo vacío 
                                 this.getCounters();
                                 this._router.navigate(['/timeline']);
                                 this.sent.emit({send:'true'}) //Emito el evento
                              });
          }else{
            this.status = 'success';
            newPubForm.reset();//Reseteo el formulario y lo vacío 
            this.getCounters();
            this._router.navigate(['/timeline']);
            this.sent.emit({send:'true'}) //Emito el evento
          }
        
          
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

  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any){
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  
  sendPublication(event){
    //console.log(event);
    this.sent.emit({send:'true'}) //Emito el evento
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
