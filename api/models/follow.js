'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;	

var FollowSchema = Schema({
	user:{ type:Schema.ObjectId, ref:'User'},//Va a guardar un documento de la colleción de User
	followed: { type:Schema.ObjectId, ref:'User'}//También es lo mismo
});

module.exports = mongoose.model('Follow', FollowSchema);