//Este es el modelo de usuarios
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;//Esto nos va a permitir definir nuevos esquemas

//Creamos la estructura que van a tener el objeto de usuarios
var UserSchema = Schema({
	name: String,
	surname: String,
	nick: String,
	email: String,
	password: String,
	role: String,
	image: String
});

//Exportamos el modelo de mongo
//Indicamos el nombre de la identidad, así como su esquema a utilizar
module.exports = mongoose.model('User', UserSchema);
