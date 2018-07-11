import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//Módulo para los formularios
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';//Módulo para hacer peticiones ajax y http a una api
import { routing, appRoutingProviders } from './app.routing';
import { MomentModule } from 'angular2-moment';//Cargamos el nuevo módulo de moment

//Módulo creado por nosotros (Mensajes)
import { MessagesModule } from './messages/messages.module';

//Servicios
import { UserService } from './user.service';
import { UploadService } from './upload.service';
import { FollowService} from './follow.service';
import { PublicationService } from './publication.service';
import { MessageService } from './message.service';
import { UserGuard } from './user.guard';

//Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersComponent } from './users/users.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TimelineComponent } from './timeline/timeline.component';
import { PublicationsComponent } from './publications/publications.component';
import { ProfileComponent } from './profile/profile.component';
import { FollowingComponent } from './following/following.component';
import { FollowedComponent } from './followed/followed.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    PublicationsComponent,
    ProfileComponent,
    FollowingComponent,
    FollowedComponent
  ],
  imports: [//Cargar módulos
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule,
    MomentModule,
    MessagesModule
  ],
  providers: [
    appRoutingProviders,
    UserService,
    UploadService,
    FollowService,
    PublicationService,
    UserGuard
  ], //En los providers cargamos servicios
  bootstrap: [AppComponent]
})
export class AppModule { }
