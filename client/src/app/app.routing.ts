import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

//Compomentes
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UsersComponent } from './users/users.component';
import { TimelineComponent } from './timeline/timeline.component';
import { ProfileComponent } from './profile/profile.component';
import { FollowingComponent } from './following/following.component';
import { FollowedComponent } from './followed/followed.component';

import { UserGuard } from './user.guard';

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
    },
    {
        path: 'mis-datos',
        component: UserEditComponent,
        canActivate: [UserGuard]
    },
    {
        path: 'usuarios/:page',
        component: UsersComponent,
        canActivate: [UserGuard]
    },
    {
        path: 'usuarios',
        component: UsersComponent,
        canActivate: [UserGuard]
    },
    {
        path:'timeline',
        component: TimelineComponent,
        canActivate: [UserGuard]
    },
    {
        path:'perfil/:id',
        component: ProfileComponent,
        canActivate: [UserGuard]
    },
    {
        path: 'siguiendo/:id/:page',
        component: FollowingComponent,
        canActivate: [UserGuard]
    },
    {
        path:'seguidores/:id/:page',
        component: FollowedComponent,
        canActivate: [UserGuard]
    },
    {
        path: '**', //Esto hace referencia a alguna ruta que no exista
        component: HomeComponent
    }
];

export const appRoutingProviders: any[] = [];//Servicio
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);//Módulo