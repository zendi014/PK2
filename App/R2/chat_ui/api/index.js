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



const st = require('./resources/students');





//npm i formidable --save
var formidable = require('formidable');
r.post('/upload_file', function(req, res){
    var f = new formidable.IncomingForm();
    f.parse(req);

    var path = "./public/uploads/";
    f.on('fileBegin', function(name, file){
        path = path + file.name;
        file.path = path;
    });
    f.on('file', function (name, file) {
        res.status(200).json({
            name: file.name,
            path: path
        })
    });
})

module.exports = r;
