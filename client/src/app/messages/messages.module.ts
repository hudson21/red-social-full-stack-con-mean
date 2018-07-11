//Todos estos módulos son necesarios para trabar con los módulos de Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';//Cargamos el nuevo módulo de moment

//Rutas
import { MessagesRoutingModule } from './messages-routing.module';

//Importamos los componentes
import { MainComponent } from './components/main/main.component';
import { AddComponent} from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SentComponent } from './components/sent/sent.component';

//Servicios
import { UserGuard } from '../user.guard';
import { UserService } from '../user.service';

//Declarar nuestros módulos 
@NgModule({
    declarations:[
        MainComponent,
        AddComponent,
        ReceivedComponent,
        SentComponent
    ],
    imports:[
        CommonModule,
        FormsModule,
        MessagesRoutingModule,
        MomentModule
    ],
    exports:[
        MainComponent,
        AddComponent,
        ReceivedComponent,
        SentComponent
    ],
    providers:[
        UserGuard,
        UserService
    ]
})
export class MessagesModule{}