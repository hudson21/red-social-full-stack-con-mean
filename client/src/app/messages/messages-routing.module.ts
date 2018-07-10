import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Componentes
import { MainComponent } from './components/main/main.component';
import { AddComponent} from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SentComponent } from './components/sent/set.component';

const messagesRoutes: Routes = [
    {
        path:'mensajes',
        component: MainComponent,
        //El children son rutas que van a ir detrás de mensajes
        children:[
            {
                path: '',
                redirectTo: 'recibidos',
                pathMatch: 'full'
            },
            {
                path:'enviar',
                component: AddComponent
            },
            {
                path: 'recibidos',
                component: ReceivedComponent
            },
            {
                path: 'enviados',
                component: SentComponent
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