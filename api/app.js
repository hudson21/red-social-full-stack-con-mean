//Aquí vamos a configurar todo lo que tiene que ver con Express
'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();//Esto ya nos carga el Framework

//Sección para cargar las rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');

//Sección para cargar middlewares
app.use(bodyParser.urlencoded({extended:false}));//Configuración necesaria para bodyParser
app.use(bodyParser.json());//Convertir a objecto JSON

//Sección para cargar el Cors y las cabeceras

//----------------------------------Sección para las rutas------------------------------------------
app.use('/api', user_routes);//Voy a tener una ruta llamada localhost:3800/api/(nombre de las rutas exportadas)
app.use('/api', follow_routes);

//Sécción para exportar la configuración
module.exports = app;//Vamos a exportar lo que app tenga