'use strict'
var bcrypt = require('bcrypt-nodejs');

//Importar el modelo de user
var User = require('../models/user');
var jwt = require('../services/jwt');

//Ruta de HOME
function home(req,res){ 
	res.status(200).send({
		message: 'Hola mundo desde el servidor de node.js'
	});
}

//Ruta de Pruebas
function pruebas(req,res){ 
	//console.log(req.body);
	res.status(200).send({
		message: 'Acción de pruebas en el servidor de node.js'
	});
}

//Función para insertar usuarios
function saveUser(req, res){
	//Recoger los parámetros de la request
	var params = req.body;
	//Creamos un nuevo usuario del modelo User
	var user = new User();

	if(params.name && params.surname && params.nick && params.email && params.password){
		//Asignando valor a cada una de las propiedades del user
		user.name = params.name;
		user.surname = params.surname;
		user.nick = params.nick;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = null;

		//Verificar si el nick y el email existen en la BD
		//Se utiliza el AND separando por comas (,)
		//Se utilizar el OR $or
		//Controlar usuarios duplicados
		User.find({ $or:[
							{email:user.email.toLowerCase()},
							{nick:user.nick.toLowerCase()}
						//El método exec es para ejecutar el callback
				    ]}).exec((err,users) =>{
				    	if(err) return res.status(500).send({message: 'Error en la petición de usuarios'});

				    	if(users && users.length >= 1){
				    		return res.status(200).send({message: 'El usuario que intenta registrar ya existe !!'});
				    	
				    	}else{
				    		//Encriptar el password y guardar los datos en la BD
							bcrypt.hash(params.password, null, null, (err, hash) =>{
								user.password = hash;

								user.save((err, userStored)=>{	
									if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

									if(userStored){
										res.status(200).send({user: userStored});//Enviar los datos a través de un objeto JSON
									}else{
										res.status(404).send({message: 'No se ha registrado el usuario'});
									}
								});
							});

				    	}
				    });

	}else{
		res.status(200).send({
			message:'Debes de llenar todos los campos necesarios!!'
		});
	}
}

function loginUser(req,res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	//Usando la coma(,) estamos usando el operador AND 
	User.findOne({email:email}, (err, user) =>{
		if(err) return res.status(500).send({message:'Error en la petición'});

		if(user){
			//comparar las contraseñas con bcrypt
			bcrypt.compare(password, user.password, (err, check)=>{
				if(check){
					//Devolver datos de usuario
					if(params.gettoken){
						//Generar y devolver el token
						return res.status(200).send({
							token: jwt.createToken(user)//Esto me devuelve un token con hash
						});

					}else{
						//Devolver los datos de usuario en claro
						user.password = undefined;
						return res.status(200).send({user});
					}
					
				}else{
					//Devolver un error
					return res.status(404).send({message:'El usuario no se ha podido identificar'});
				}
			});
		}else{
			return res.status(404).send({message:'El usuario no se ha podido identificar!!!!'});
		}	

	});
}

//Exporto las funciones fuera de este fichero
module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser
};