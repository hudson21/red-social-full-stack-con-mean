import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.routing';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [//Cargar módulos
    BrowserModule,
    routing
  ],
  providers: [
    appRoutingProviders
  ], //En los providers cargamos servicios
  bootstrap: [AppComponent]
})
export class AppModule { }
