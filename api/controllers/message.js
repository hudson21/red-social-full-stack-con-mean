'use strict'

//Librerías
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

//Modelos
var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function probando(req,res){
    res.status(200).send({message:'Hola desde el controlador de mensajes'});
}

//Método para guardar los mensajes
function saveMessage(req, res){
    //Recoger los parámetros que nos llegan por el body
    var params = req.body;
    //Comprobar si existe el texto del mensaje y el usuario destinatario
    if(!params.text || !params.receiver) return res.status(200).send({message:'Envía los datos datos necesarios'});

    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = 'false';

    message.save((err, messageStored) =>{
        if(err) return res.status(500).send({message:'Error en la petición'});
        if(!messageStored) return res.status(500).send({message:'Error al enviar el mensaje'});
        
        return res.status(200).send({message:messageStored});
    });
}

//Método para listar los mensajes recibidos paginados
function getReceivedMessages(req, res){
    //Recoger el id del usuario logueado
    var userId = req.user.sub

    //Establecer la página
    var page =1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;
    //Hacer una consulta a los mensajes donde el destinatario seamos nosotros
    Message.find({'receiver': userId})
        .populate('emitter', 'name surname _id nick image')//Puedo decirle que campos quiero que se muestren
        .sort('-created_at')
        .paginate(page,itemsPerPage, (err, messages, total) =>{
            if(err) return res.status(500).send({message:'Error en la petición'});
            if(!messages) return res.status(404).send({message:'No hay mensajes'});

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage),
                messages: messages
            });
            
    });
}

//Método para listar los mensajes que hemos enviado paginados
function getEmittedMessages(req, res){
    //Recoger el id del usuario logueado
    var userId = req.user.sub

    //Establecer la página
    var page =1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;
    //Hacer una consulta a los mensajes donde el destinatario seamos nosotros
    Message.find({'emitter': userId})
        .populate('emitter receiver', 'name surname _id nick image')//Puedo decirle que campos quiero que se muestren
        .sort('-created_at')
        .paginate(page,itemsPerPage, (err, messages, total) =>{
            if(err) return res.status(500).send({message:'Error en la petición'});
            if(!messages) return res.status(404).send({message:'No hay mensajes'});

            return res.status(200).send({
                total: total,
                pages: Math.ceil(total/itemsPerPage),
                messages: messages
            });
            
    });
}

//Método para contar los mensajes que tenemos sin leer
function getUnviewedMessages(req, res){
    var userId = req.user.sub;

    Message.count({'receiver': userId, 'viewed':'false'}).exec((err, count) =>{
        if(err) return res.status(500).send({message:'Error en la petición'});
        return res.status(200).send({
            'unviewed': count
        });
    });
}

//Método para marcar los mensajes como leídos
function setViewedMessages(req, res){
    var userId = req.user.sub;
    //Con el multi se actualizan todos los documentos
    Message.update({'receiver': userId, 'viewed':'false'}, {'viewed': 'true'}, {'multi':true}, (err, messagesUpdated)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});
        
        return res.status(200).send({messages:messagesUpdated});
    }); 
}

module.exports ={
    probando,
    saveMessage,
    getReceivedMessages,
    getEmittedMessages,
    getUnviewedMessages,
    setViewedMessages
};