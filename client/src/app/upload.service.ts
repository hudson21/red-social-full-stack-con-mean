import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public url:string;

  constructor() {
    this.url = GLOBAL.url;
   }

   makeFileRequest(url:string, params: Array<string>, files: Array<File>, token: string,name:string){
    //Hacer la petición con una promesa
    return new Promise(function(resolve, reject){
        //Vamos a simular una estructura de formulario clásica
        var formData: any = new FormData();
        var xhr = new XMLHttpRequest();//Es el objeto que nos permite hacer peticiones ajax en javascript

        for(var i = 0; i < files.length; i++){
          //Estoy guardando en el formData los parámetros de la imagen
          formData.append(name, files[i], files[i].name);
        }

        //Hacer la petición AJAX
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    //Hacer la ejecución de esto correctamente
                    resolve(JSON.parse(xhr.response));
                }else{
                    //No me dejará hacer la petición AJAX
                    reject(xhr.response);
                }
            }
        }

        //Hacer la petición AJAX por POST
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Authorization', token);
        xhr.send(formData);
    });
   }
}
