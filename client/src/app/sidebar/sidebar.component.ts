import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { GLOBAL } from '../global';
import { Publication } from '../models/publication';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers:[ UserService]
})
export class SidebarComponent implements OnInit {

  public url:string;
  public token;
  public stats;
  public status;
  public identity;
  public publication: Publication;

  constructor(
    private _userService : UserService
  ) {
    this.url = GLOBAL.url;
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.publication = new Publication("","","","",this.identity._id);
   }

  ngOnInit() {
    console.log("Cargado exitosamente el sidebar.component.ts :)")
  }

  onSubmit(){
    console.log(this.publication);
  }


}
