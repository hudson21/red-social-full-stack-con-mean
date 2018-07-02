'use strict'
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');//Librería filesystem de node
var path = require('path');

//Importar el modelo de user
var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');
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

//Función para el login de usuarios
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
					//Devolver datos de usuario si viene dentro  de la URL
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

//Método para conseguir datos de un usuario
function getUser(req, res){
	//Obtener el id por la URL
	var userId = req.params.id;

	//Buscar el usuario por el ID
	User.findById(userId, (err, user)=>{
		if(err) return res.status(500).send({message:'Error en la petición'});

		if(!user) return res.status(404).send({message:'El usuario no existe'});

		//userId --> Es el que le pasamos por la URL
		//req.user.sub --> Es el que nos regresa el JWT decoded
		followThisUser(req.user.sub, userId).then((value) =>{
			user.password = undefined;
			return res.status(200).send({
				user, 
				following: value.following,
				followed: value.followed
			});
		});

		
	});
}

//Función Asíncrona para getUser (Lo que permite ejecutarla en cualquier otro método)
async function followThisUser(identity_user_id, user_id){
	try {
		//Obetener el usuario al que seguimos
        var following = await Follow.findOne({ user: identity_user_id, followed: user_id}).exec()
            .then((following) => {
                //console.log(following);
                return following;
            })
            .catch((err)=>{
                return handleerror(err);
			});
		
		//Obetener el usuario que nos sigue
        var followed = await Follow.findOne({ user: user_id, followed: identity_user_id}).exec()
            .then((followed) => {
                //console.log(followed);
                return followed;
            })
            .catch((err)=>{
                return handleerror(err);
			});
			
        return {
            following: following,
            followed: followed
		}
		
    } catch(e){
        console.log(e);
    }
}

//Método para devolver un listado de usuarios paginados
function getUsers(req, res){
	//Recoger el id del usuario que esté logueado. Lo obetemos del usuario que se ha decodificado el
	//token por el middleware de autenticación

	//Este req.user es enviado desde el archivo de autenticación authenticated.js en los middlewares
	var identity_user_id = req.user.sub;//Accedo a la propiedad sub del payload guardado

	var page = 1;
	if(req.params.page){
		var page = req.params.page;
	}

	//Cantidad de usuarios que se van a mostrar por página
	var itemsPerPage = 5;

	//Obtener todos los usuarios y ordenarlos por su ID
	//El total serán todos los usuarios que hay en la BD
	User.find().sort('_id').paginate(page, itemsPerPage, (err,users,total)=>{
		if(err) return res.status(500).send({message:'Error en la petición'});

		if(!users) return res.status(404).send({message: 'No hay usuarios disponibles'});

		followUserIds(identity_user_id).then((value) =>{
			return res.status(200).send({
				users,
				users_following: value.following,
				users_follow_me: value.followed,
				total,
				//Me hace un redondeo del total de las páginas/usuarios por página
				pages: Math.ceil(total/itemsPerPage)
			});
		});

		 
	});
}

//Función Asíncrona para getUsers
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

//Función para contar los seguidores y a los que seguimos
function getCounters(req, res){
	var userId = req.user.sub; 

	if(req.params.id){
		userId = req.params.id;
	}
	getCountFollow(userId).then((value) =>{
		return res.status(200).send(value);
	});
	
}

//Función Asíncrona para getCounters
async function getCountFollow(user_id){

   try{
	    //Llamadas síncronas
		//Variable para conseguir a los usuarios que seguimos
		var following = await Follow.count({'user': user_id}).exec()
			.then((following) =>{
				return following;
			})
			.catch((err) =>{
				return handleerror(err);
			});

		//Variable para consguir a los usuarios que nos siguen
		var followed = await Follow.count({'followed':user_id}).exec()
			.then((followed) =>{
				return followed;
			})
			.catch((err) =>{
				return handleerror(err);
			});

		//Variable para los publicaciones para obtener las publicaciones de los usuarios a los que seguimos
		var publications = await Publication.count({'user':user_id}).exec()
			.then((publications) =>{
				return publications
			})
			.catch((err) =>{
				return handleerror(err);
			});

		return {
			following: following,
			followed: followed,
			publications: publications
		}

	}catch(e){
	   console.log(e);
	}

}

//Método para actualizar los datos de un usuario
function updateUser(req,res){
	//Recoger por la URL el id del usuario a actualizar
	var userId = req.params.id;

	//Recoger los campos nuevos a actualizar
	var update = req.body;
	
	//Borrar la propiedad password
	delete update.password;

	//Verificar si el id del usuario logueado es el id del usuario a actualizar
	if(userId != req.user.sub){
		return res.status(500).send({message:'No tienes permiso para actualizar los datos del usuario'});
	}
	//Buscar el usuario por ID y actualizarlo en la BD
	//La propiedad new es para regresarme el objeto actualizado
	User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated)=>{
		if(err) return res.status(500).send({message:'Error en la petición'});

		if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
		
		return res.status(200).send({user: userUpdated});
	});

}

//Método para subir archivos de imagen/avatar de usuario
function uploadImage(req, res){
	//Recoger por la URL el id del usuario a actualizar
	var userId = req.params.id;

	//Si hay una propiedad "files" en los parámetros de la petición (req)
	if(req.files){

		var file_path = req.files.image.path;
		console.log(file_path);

		var file_split = file_path.split('\\');// (\) Para escapar el caracter (\) Para separarlo por ese mismo
		console.log(file_split);

		var file_name = file_split[2];//Cargamos la posición donde se encuentra el nombre de la imagen
		console.log(file_name);

		//Quiero cortar por el punto para obtener la extensión de la imagen
		var ext_split = file_name.split('\.');
		console.log(ext_split);

		var file_ext = ext_split[1];
		console.log(file_ext);

		//Verificar si el id del usuario logueado es igual al id del usuario al que se le quiere subir el avatar 
		if(userId != req.user.sub){
			return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
		}

		//Comprobar que la extensión de la imagen sea JPG
		if(file_ext == 'png' || file_ext == 'PNG' || file_ext == 'jpg' 
		|| file_ext == 'JPG' || file_ext == 'jpeg' || file_ext == 'JPEG' 
		|| file_ext == 'gif' || file_ext == 'GIF'){
			//Actualizar documento de usuario logueado
			User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated)=>{
				if(err) return res.status(500).send({message:'Error en la petición'});

				if(!userUpdated) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
		
				return res.status(200).send({user: userUpdated});	
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
	var path_file = './uploads/users/'+image_file;//Ruta completa del sistema de ficheros

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

//Exporto las funciones fuera de este fichero
module.exports = {
	home,
	pruebas,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	getCounters,
	updateUser,
	uploadImage,
	getImageFile
	
};