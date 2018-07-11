import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';
import { AddComponent} from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SentComponent } from './components/sent/sent.component';

import { UserGuard } from '../user.guard';

const messagesRoutes: Routes = [
    {
        path:'mensajes',
        component: MainComponent,
        //El children son rutas que van a ir detrás de mensajes
        children:[
            {
                path: '',
                redirectTo: 'recibidos',
                pathMatch: 'full',
                canActivate:[UserGuard]
            },
            {
                path:'enviar',
                component: AddComponent,
                canActivate:[UserGuard]
            },
            {
                path: 'recibidos',
                component: ReceivedComponent,
                canActivate:[UserGuard]
            },
            {
                path: 'recibidos/:page',
                component: ReceivedComponent,
                canActivate:[UserGuard]
            },
            {
                path: 'enviados',
                component: SentComponent,
                canActivate:[UserGuard]
            },
            {
                path: 'enviados/:page',
                component: SentComponent,
                canActivate:[UserGuard]
            }
        ]
    }
];

@NgModule({
    imports: [
        //De esta manera estas rutas se van aplicar a las rutas globales
        RouterModule.forChild(messagesRoutes)
    ],
    exports:[
        RouterModule //Para poder utilizar este módulo fuera de esta clase
    ]
})
export class MessagesRoutingModule {}