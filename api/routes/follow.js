'use strict'

var express = require('express');
//Exportar el controlador de follows
var FollowController = require('../controllers/follow');
//Cargar el router para las rutas con el express
var api = express.Router();

//Exportar los middlewares
var md_auth = require('../middlewares/authenticated');

api.post('/follow',md_auth.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id',md_auth.ensureAuth, FollowController.deleteFollow);
api.get('/following/:id?/:page?',md_auth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id?/:page?',md_auth.ensureAuth, FollowController.getFollowedUsers);
api.get('/get-my-follows/:followed?',md_auth.ensureAuth, FollowController.getMyFollows);

module.exports = api;
