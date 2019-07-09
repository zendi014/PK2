var e = require('express');
var r = e.Router();


var u = require('./resources/users');
r.get('/users', u.read); //Read
r.get('/user/:user_key', u.detail); //Detail
r.post('/users', u.create); //Create
r.post('/user/update', u.update); //Update
r.post('/user/delete', u.delete); //Delete


var l = require('./resources/lectures');
r.get('/lectures', l.read); //Read
r.post('/lectures', l.create); //Create
r.put('/lecture/:key', l.update); //Update
r.delete('/lecture/:key', l.delete); //Delete


var al = require('./resources/apply_lecture');
r.get('/apply_lecture', al.read); //Read
r.post('/apply_lecture', al.create); //Create
r.put('/apply_lecture/:key', al.update); //Update
r.delete('/apply_lecture/:key', al.delete); //Delete


module.exports = r;