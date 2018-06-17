//Este va a ser el punto de partida para lanzar el backend
//Esta instrucción nos va a permitir utilizar los estándares de enmascript
'use strict'

//Cargar la librería de mongoose para podernos conectar a mongoDB y trabajar con la base de datos
var mongoose = require('mongoose');
var app = require('./app');//Requerimos el archivo de app.js
var port = 3800;


//Conexión a la Base de datos
mongoose.Promise = global.Promise;//Hacer las promesas para conectarnos a la BD

//useMongoClient es para conectamos a la se de datos como clientes   , { useMongoClient:true }
mongoose.connect('mongodb://localhost:27017/curso_mean_social')
		.then(()=>{
			console.log("La conexión a la base de datos curso_mean_social se ha realizaco correctamente!!");

			//Crear el servidor
			app.listen(port, () =>{
				console.log('Servidor corriendo en http://localhost:3800');
			});
		})
		.catch(err => console.log(err));

//**************************************(Crear servidor web utilizando Express)******************************




