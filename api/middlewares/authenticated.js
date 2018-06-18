'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso_desarrollar_red_social_angular_djhasudpypuy27869134yqhbljsacbvAGK676Q>GKVFHvAGK676Q>';

exports.ensureAuth = function(req, res, next){//Request, Response, Next es saltar a otra funcionalidad
	if(!req.headers.authorization){
		return res.status(403).send({message: 'La petición no tiene la cabecera de autenticación'});
	}

	//Remplazar las comillas simples o dobles que tenga el string de token
	var token = req.headers.authorization.replace(/['"]+/g,'');

	//Decodificar el payload
	try{
		var payload = jwt.decode(token, secret);

		//Si la fecha de expiración es menor a la fecha actual 
		if(payload.exp <= moment().unix()){
			return res.status(401).send({message:'El token ha expirado'});
		}

	}catch(ex){
		return res.status(404).send({message:'El token no es válido'});
	}

	//En los controladores tendría acceso al req.user
	req.user = payload;

	//Saltar a la siguiente acción 	que tenga node.js
	next();
	

}