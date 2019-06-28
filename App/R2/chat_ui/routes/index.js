var express = require('express');
var r = express.Router();



// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
  if (req.session.user && req.cookies.user_key) {
    next();
  } else {
    res.redirect('/');
  }
};




const a = require('./resources/admin');
r.get('/admin', sessionChecker, a.index);



const l = require('./resources/lectures');
r.get('/lectures', l.index);
r.get('/form_lectures/:lid', l.form_lectures);



const st = require('./resources/student');
r.get('/student', sessionChecker, st.index);



const lr = require('./resources/lecturer');
r.get('/lecturer', sessionChecker, lr.index);
r.post('/form_lecturer', lr.form_lecturer);
r.get('/table_lecturer', lr.table_lecturer);







r.get('/upload_file', function(req, res){
    res.render('./main/upload_file')
});











r.get('/test', function(req, res){
  data = {
      title: "TEST",
      name: 'App',
  }
  res.render('./main/test', data);
});


r.get('/conversation', function (req, res) {
  data = {
    title: "Conversation",
    name: 'App',
  }
  res.render('./main/conversation', data);
});



module.exports = r;
