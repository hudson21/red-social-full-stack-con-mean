'use strict'

var jwt = require('jwt-simple');
//Vamos a utilizar la librería moment para generar fechas
var moment = require('moment');
var secret = 'clave_secreta_curso_desarrollar_red_social_angular_djhasudpypuy27869134yqhbljsacbvAGK676Q>GKVFHvAGK676Q>';

//De esta manera podemos exportar una sola función
exports.createToken = function(user){
	//Con este payload generamos un token
	var payload = {
		sub:user._id,
		name:user.name,
		surname:user.surname,
		nick:user.nick,
		email:user.email,
		role:user.role,
		image:user.image,
		iat:moment().unix(),//Aquí tomamos el tiempo exacto donde se ha creado el token
		exp:moment().add(30,'days').unix()//Vamos agregarle una expiración de 30 días al token
	};

	//Generar el token
	return jwt.encode(payload, secret);
};