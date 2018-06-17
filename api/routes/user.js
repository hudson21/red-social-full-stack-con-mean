'use strict'

var express  = require('express');
var UserController = require('../controllers/user');

//Para poder acceder a los métodos de POST, GET, PUT, DELETE, etc
var api = express.Router();

//Llamamos a la función de home que está dentro del controlador de user
api.get('/home', UserController.home);
api.get('/pruebas', UserController.pruebas);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);

//Exportamos todo lo que tenga dentro de api (En este caso las rutas)
module.exports = api;


