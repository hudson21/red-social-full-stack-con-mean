'use strict'

//Librerías
var express = require('express');
var PublicationController = require('../controllers/publication');
var api = express.Router();

//Middleware
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
//Indicarle al multiparty donde tiene que guardar los archivos
var md_upload = multipart({uploadDir:'./uploads/publications'});

api.get('/probando-pub', md_auth.ensureAuth, PublicationController.probando);
api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);


//Exporto todo el objeto api
module.exports = api;