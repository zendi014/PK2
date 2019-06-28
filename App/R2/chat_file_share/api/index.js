var express = require('express');
var r = express.Router();

const l = require('./resources/lectures');
r.get('/lectures', l.index);
r.get('/lectures/:lid', l.show);
r.post('/lectures', l.create);
r.put('/lectures/:lid', l.update);



const lr = require('./resources/lecturer');
r.get('/lecturer', lr.index);
r.get('/lecturer/:lid', lr.show);
r.post('/lecturer', lr.create);
r.put('/lecturer/:lid', lr.update);


const u = require('./resources/users');
r.get('/users', u.index); //user lists
r.get('/user/:ukey', u.detail); //user by key



const st = require('./resources/students');


const cnv = require('./resources/conversations');
r.post('/conversations', cnv.create);
r.get('/conversations/:msg_to', cnv.index);
r.post('/conversations/upload_file', cnv.upload_file);


module.exports = r;