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
api.get('/publications/:page?', md_auth.ensureAuth, PublicationController.getPublications);
api.get('/publications-user/:user/:page?', md_auth.ensureAuth, PublicationController.getPublicationsUser);
api.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);
api.delete('/publication/:id', md_auth.ensureAuth, PublicationController.deletePublication);
api.post('/upload-image-pub/:id',[md_auth.ensureAuth, md_upload], PublicationController.uploadImage);
api.get('/get-image-pub/:imageFile', PublicationController.getImageFile);

//Exporto todo el objeto api
module.exports = api;