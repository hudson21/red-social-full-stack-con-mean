	'use strict'

//var path = require('path');//Llamamos a la librería path
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

//Exportamos los modelos
var User = require('../models/user');
var Follow = require ('../models/follow');

//Método para que un usuario siga a otro
function saveFollow(req,res){
	//Recoger los parámetros que llegan por la URL por POST
	var params = req.body;

	var follow = new Follow();
	follow.user = req.user.sub;//Guardamos el id del usuario logueado (Usuario que va a seguir)
	follow.followed = params.followed;//Guardamos el id del usuario que será seguido

	//Guardar el documento en la BD
	follow.save((err,followStored)=>{
		if(err) return res.status(500).send({message:'Error al guardar el seguimiento'});

		if(!followStored) return res.status(404).send({message:'El seguimiento no se ha guardado'});

		return res.status(200).send({follow:followStored});
	});
}

//Método para dejar de seguir a un usuario
function deleteFollow(req,res){
	//Recoger el usuario que está logueado
	var userId = req.user.sub;
	//Recoger el usuario al que vamos a dejar de seguir
	var followId = req.params.id;

	//Encontrará los 
	Follow.find({'user':userId, 'followed':followId}).remove(err =>{
		if(err) return res.status(500).send({message:'Error al dejar de seguir'});

		return res.status(200).send({message: 'El follow se ha eliminado!!'});
	});
}

//Método para mostrar los usuarios seguidos 
function getFollowingUsers(req, res){
	//Recoger el usuario logueado
	var userId = req.user.sub;

	//Comprobar si nos llega un id por la URL y un parámetro llamado page
	if(req.params.id && req.params.page){
		userId = req.params.id;
	}

	//Comprobar si nos llega la página por la URL
	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}else{
		page = req.params.id;
	}

	//Listar solo 4 usuarios por página
	var itemsPerPage = 4;

	//Buscar en los follows donde el usuarios logueado sea el que aparezca
	//El populate es para sustituir el id del usuario al que se sigue con todos sus datos relacionados
	Follow.find({user: userId}).populate({path:'followed'}).paginate(page, itemsPerPage, (err,follows,total)=>{
		if(err) return res.status(500).send({message:'Error en el servidor'});

		if(!follows) return res.status(404).send({message:'No estás siguiendo a ningún usuario'});

		followUserIds(req.user.sub).then((value) =>{
			return res.status(200).send({
				total: total,//Va a ir el todal de documentos que hay en la colección 
				pages: Math.ceil(total/itemsPerPage),//Calcular el número total de páginas
				follows,
				users_following: value.following,
				users_follow_me: value.followed
			});
		});
	});
}

//Función asíncrona para el método getFollowingUsers y getFollowedUsers
async function followUserIds(user_id){

	try{
	   //Obejter los usuarios que seguimos			 //El select es para mostrar los campos que yo quiera
	   var following = await Follow.find({'user':user_id }).select({'_id':0, '__v':0, 'user': 0}).exec()
		   .then((following) =>{
			   var follows_clean = [];
   
			   following.forEach((follow) =>{
				   //console.log("followed", follow.followed);
				   //Guardar los usuarios que yo sigo
				   follows_clean.push(follow.followed);
			   });
   
			   return follows_clean;
		   })
		   .catch((err)=>{
			   return handleerror(err);
		   });
   
	   //Obejter los usuarios que seguimos			 //El select es para mostrar los campos que yo quiera
	   var followed = await Follow.find({'followed':user_id }).select({'_id':0, '__v':0, 'followed': 0}).exec()
		   .then((following) =>{
			   var follows_clean = [];
   
			   following.forEach((follow) =>{
				   //console.log("user", follow.user);
				   //Guardar los usuarios que yo sigo
				   follows_clean.push(follow.user);
			   });
   
			   return follows_clean;
		   })
		   .catch((err)=>{
			   return handleerror(err);
		   });
   
	   return {
		   following: following,
		   followed: followed
	   }
	}catch(e){
	   console.log(e);
   }
	   
   }

//Método para mostrar los usuarios seguidores de nosotros
function getFollowedUsers(req,res){
	var userId = req.user.sub;

	//Comprobar si nos llega un id por la URL
	if(req.params.id && req.params.page){
		userId = req.params.id;
	}

	//Comprobar si nos llega la página por la URL
	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}else{
		page = req.params.id;
	}

	//Listar solo 4 usuarios por página
	var itemsPerPage = 4;

	//Buscar en los follows donde el usuarios logueado sea el que aparezca
	//El populate es para sustituir el id del usuario al que se sigue con todos sus datos relacionados
	Follow.find({followed: userId}).populate('user').paginate(page, itemsPerPage, (err,follows,total)=>{
		if(err) return res.status(500).send({message:'Error en el servidor'});

		if(!follows) return res.status(404).send({message:'No te sigue ningún usuario'});

		followUserIds(req.user.sub).then((value) =>{
			return res.status(200).send({
				total: total,//Va a ir el todal de documentos que hay en la colección 
				pages: Math.ceil(total/itemsPerPage),//Calcular el número total de páginas
				follows,
				users_following: value.following,
				users_follow_me: value.followed
			});
		});
	});
}

//Listar los usuarios que yo estoy siguiendo o me siguen sin paginado
function getMyFollows(req,res){
	var userId = req.user.sub;

	//Buscar los usuarios que yo sigo
	var find = Follow.find({user:userId});

	//Buscar los usuarios que me estan siguiendo
	if(req.params.followed){
		find = Follow.find({followed:userId});
	}

	find.populate('user followed').exec((err, follows) =>{
		if(err) return res.status(500).send({message:'Error en el servidor'});

		if(!follows) return res.status(404).send({message:'No sigues a ningún usuario'});

		return res.status(200).send({follows});
	});
}

module.exports = {
	saveFollow,
	deleteFollow,
	getFollowingUsers,
	getFollowedUsers,
	getMyFollows
};