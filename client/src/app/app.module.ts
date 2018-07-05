import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//Módulo para los formularios
import { FormsModule } from '@angular/forms';
//import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';//Módulo para hacer peticiones ajax y http a una api
import { routing, appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserService } from './user.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [//Cargar módulos
    BrowserModule,
    FormsModule,
    routing,
    HttpClientModule
  ],
  providers: [
    appRoutingProviders,
    UserService
  ], //En los providers cargamos servicios
  bootstrap: [AppComponent]
})
export class AppModule { }