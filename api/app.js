//Aquí vamos a configurar todo lo que tiene que ver con Express
'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();//Esto ya nos carga el Framework

//Sección para cargar las rutas

//Sección para cargar middlewares
app.use(bodyParser.urlencoded({extended:false}));//Configuración necesaria para bodyParser
app.use(bodyParser.json());//Convertir a objecto JSON

//Sección para cargar el Cors y las cabeceras

//----------------------------------Sección para las rutas------------------------------------------
//Ruta de HOME
app.get('/', (req,res)=>{ 
	res.status(200).send({
		message: 'Hola mundo desde el servidor de node.js'
	});
});//La request y las respuesta del método GET

//Ruta de Pruebas
app.get('/pruebas', (req,res)=>{ 
	res.status(200).send({
		message: 'Acción de pruebas en el servidor de node.js'
	});
});//La request y las respuesta del método GET 

//Sécción para exportar la configuración
module.exports = app;//Vamos a exportar lo que app tenga