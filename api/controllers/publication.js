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

module.exports = {
    probando,
    savePublication
};