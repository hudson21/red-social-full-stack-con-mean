'use strict'

//Librerías
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

//Modelos
var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando(req, res){
    res.status(200).send({
        message:'Hola desde el controlador de publicaciones'
    });
}

//Método para dar de alta nuevas publicaciones
function savePublication(req, res){
    //Recoger los parámetros que llegan por el body
    var params = req.body;

    //Sino me llega el parámetro del texto
    if(!params.text) return res.status(200).send({message:'Debes enviar un texto !!'});

    //Crear una instancia del modelo Publication
    var publication = new Publication();
    publication.text = params.text;
    publication.file = 'null';//En un principio no vamos a subir ningún archivo
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) =>{
        if(err) return res.status(500).send({message:'Error al guardar la publicación'});

        if(!publicationStored) return res.status(404).send({message:'La publicación no ha sido guardada :('});

        return res.status(200).send({publication: publicationStored});
    });
}

//Método para devoler todas las publicaciones de los usuarios que yo sigo (TIMELINE)
function getPublications(req, res){
    //Recoger el parámetro de la página en la que estamos
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }
    //Establecer la cantidad de elementos por página
    var itemsPerPage = 4;

    //Hacer un find de todos los usuarios que seguimos
    Follow.find({'user': req.user.sub }).populate('followed').exec((err, follows) =>{
        if(err) return res.status(500).send({message:'Error al devolver el seguimiento'});

        //Hacer un array de de ids de los usuarios que estamos siguiendo
        var follows_clean = [];
        follows.forEach((follow) =>{
            //Meter los ids de los usuarios a los que seguimos 
            follows_clean.push(follow.followed);
        });
        
        //Buscar las publicaciones de esos usuarios a los que sigo
        //Buscar todos los documentos cuyo usuario esté contenido dentro del array follows_clean
                                 //$in es para buscar dentro de un array
        Publication.find({'user':{'$in': follows_clean }})
            .sort('created_at')
            .populate('user')                               //Total de elementos que hay en las publicaciones
            .paginate(page, itemsPerPage, (err, publications, total)=>{
                if(err) return res.status(500).send({message:'Error al devolver publicaciones'});

                if(!publications) return res.status(404).send({message:'No hay publicaciones'});

                return res.status(200).send({
                    total_items: total,
                    pages: Math.ceil(total/itemsPerPage),
                    page: page,
                    publications: publications
                });
            }); 
    });
}

//Método para devolver una publicación
function getPublication(req, res){
    //Recoger el id de la publicación por la URL
    var publicationId = req.params.id;

    Publication.findById(publicationId, (err, publication) =>{
        if(err) return res.status(500).send({message:'Error al devolver la publicación'});

        if(!publication) return res.status(404).send({message:'No existe la publicación'});

        return res.status(200).send({publication});
    });
}

//Método para eliminar una publicación
function deletePublication(req, res){
    var publicationId = req.params.id;

    Publication.findOneAndRemove({'user': req.user.sub, '_id': publicationId},(err, publicationRemoved) => {
        if(err) return res.status(500).send({message: 'Error al borrar publicación'});

        if(!publicationRemoved) return res.status(404).send({message: 'Error la publicacion no existe'});

        return res.status(200).send({message: 'Publicación eliminada correctamente'});
        });
}

//Método para subir imágenes a las publicaciones
function uploadImage(req, res){
	//Recoger por la URL el id de la publiación a actualizar
	var publicationId = req.params.id;

	//Si hay una propiedad "files" en los parámetros de la petición (req)
	if(req.files){

		var file_path = req.files.image.path;

		var file_split = file_path.split('\\');// (\) Para escapar el caracter (\) Para separarlo por ese mismo

		var file_name = file_split[2];//Cargamos la posición donde se encuentra el nombre de la imagen

		//Quiero cortar por el punto para obtener la extensión de la imagen
		var ext_split = file_name.split('\.');

		var file_ext = ext_split[1];

		//Comprobar que la extensión de la imagen sea JPG
		if(file_ext == 'png' || file_ext == 'PNG' || file_ext == 'jpg' 
		|| file_ext == 'JPG' || file_ext == 'jpeg' || file_ext == 'JPEG' 
		|| file_ext == 'gif' || file_ext == 'GIF'){

        //
        Publication.findOne({'user':req.user.sub, '_id': publicationId}).exec((err, publication) =>{
            if(publication){
                //Actualizar documento de la publicación       new:Devolver el objeto nuevo publicado
                Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdated)=>{
                    if(err) return res.status(500).send({message:'Error en la petición'});

                    if(!publicationUpdated) return res.status(404).send({message:'No se ha podido actualizar la publicación'});
            
                    return res.status(200).send({publication: publicationUpdated});	
                });
            }else{
                return removeFilesOfUploads(res, file_path, 'No tienes permisos para actualizar esta publicación');
            }
        });
			

		}else{
			//Eliminar directamente la imagen
			return removeFilesOfUploads(res, file_path, 'Extensión no válida');
		}
	
	}else{
		return res.status(200).send({message:'No se han subido imágenes '});
	}

}

function removeFilesOfUploads(res, file_path, message){
	//Eliminar directamente la imagen
	fs.unlink(file_path, (err)=>{
		return res.status(200).send({message: message}); 
	});
}

//Método para devolver la imagen de un usuario
function getImageFile(req, res){
	//Recoger parámetro imageFile por la URL
	var image_file = req.params.imageFile;
	var path_file = './uploads/publications/'+image_file;//Ruta completa del sistema de ficheros

	//Comprobar que el fichero existe
	fs.exists(path_file, (exists)=>{
		if(exists){
			//El sendFile es un método que tiene el propio express
			res.sendFile(path.resolve(path_file));//Devolver el fichero
		}else{
			res.status(200).send({message:'No existe la imagen'});
		}
	});
}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
};