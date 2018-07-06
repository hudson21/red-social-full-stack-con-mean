import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Compomentes
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UserEditComponent } from './user-edit/user-edit.component';

const appRoutes: Routes = [
    {
        path:'',
        pathMatch: 'full',
        component: HomeComponent
    },
    {
        path:'login',
        component: LoginComponent
    },
    {
        path:'registro',
        component: RegisterComponent
    },
    {
        path:'home',
        component: HomeComponent
    },{
        path: 'mis-datos',
        component: UserEditComponent
    }
];

export const appRoutingProviders: any[] = [];//Servicio
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);//Módulo