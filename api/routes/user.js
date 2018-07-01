'use strict'

var express  = require('express');
var UserController = require('../controllers/user');

//Para poder acceder a los métodos de POST, GET, PUT, DELETE, etc
var api = express.Router();

//Cargar el middleware de autenticación
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');//Cargamos el middleware de multipart para las imágenes
var md_upload = multipart({uploadDir:'./uploads/users'});

//Llamamos a la función de home que está dentro del controlador de user
api.get('/home', UserController.home);
api.get('/pruebas', md_auth.ensureAuth, UserController.pruebas);//El segundo parámetro es el middleware
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.get('/user/:id',md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?',md_auth.ensureAuth, UserController.getUsers);
api.get('/counters/:id?',md_auth.ensureAuth, UserController.getCounters );
api.put('/update-user/:id',md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

//Exportamos todo lo que tenga dentro de api (En este caso las rutas)
module.exports = api;


