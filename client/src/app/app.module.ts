import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//Módulo para los formularios
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';//Módulo para hacer peticiones ajax y http a una api
import { routing, appRoutingProviders } from './app.routing';

import { UserService } from './user.service';
import { UploadService } from './upload.service';
import { FollowService} from './follow.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersComponent } from './users/users.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent
  ],
  imports: [//Cargar módulos
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule
  ],
  providers: [
    appRoutingProviders,
    UserService,
    UploadService,
    FollowService
  ], //En los providers cargamos servicios
  bootstrap: [AppComponent]
})
export class AppModule { }
