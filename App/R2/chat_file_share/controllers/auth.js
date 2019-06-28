const fs = require('../api/sdk/fs.js');
var md5 = require("md5");

var fadmin = require("firebase-admin");
var service_account = require("../api/sdk/campus-app-umb.json")


var db = fadmin.firestore();


if (fadmin.apps.length > 0) {
  fadmin.app();
} else {
  fadmin.initializeApp({
    credential: fadmin.credential.cert(service_account),
    databaseURL: "https://campus-app-umb.firebaseio.com"
  });
  db.settings({
    timestampsInSnapshots: true
  });
}

const fauth = require('firebaseauth');
const fsa = new fauth("AIzaSyDl2GPRcs72cTxMjx0d9e0MDuQjif-OM10");


let users = db.collection('users');
let students = db.collection('students');
let lecturers = db.collection('lecturers');




module.exports = function (app) {

  app.use((req, res, next) => {
      if(req.cookies.user_key && !req.session.user){
        res.clearCookie("user_key")
      }
      next()
  })


  var sessionChecker = (req, res, next) => {
      if(req.cookies.user_key && req.session.user){
          if(req.session.user.role == "student"){
              res.redirect('student')
          } else if(req.session.user.role == "lecturer"){
              res.redirect('lecturer')
          }else{
              res.redirect('admin')
          }
      }else{
          next();
      }
  }



  app.get('/', sessionChecker, (req, res) => {
      res.redirect('/login')
  })


  app.route('/login')
     .get(sessionChecker, (req, res) => {
        res.render('./main/login')
     }).post((req, res) => {
       fsa.signInWithEmail(req.body.email, md5(req.body.password), function(e, r){
           if(e){
             res.json(e)//error
           }else{
             users.where("email", "==", req.body.email)
                  .get().then((s)=>{
                      s.forEach((d)=>{
                          req.session.user = Object.assign(
                            d.data(),
                            {"user_key": d.id}
                          )

                          res.json({
                              status : "success"
                          })
                      })
                  })
           }
        })
     });


   app.route('/register/:role')
      .get(sessionChecker, (req, res) => {
         res.render('./main/register', {role : req.params.role})
      }).post((req, res) => {
          fsa.signInWithEmail(req.body.email, md5(req.body.password), function(e, r){
              if(e){
                  // console.log(e);
                  if(e.code == "EMAIL_NOT_FOUND"){
                    fadmin.auth().createUser({
                      email : req.body.email,
                      password : md5(req.body.password),
                      displayName : req.body.full_name
                    }).then(function(u){
                        if(u){
                            users.add({
                              email : req.body.email,
                              full_name : req.body.full_name,
                              phone : req.body.phone,
                              role : req.params.role,
                              major : req.body.major
                            }).then( s => {
                                if(s){
                                    let d = new Date()
                                    if(req.params.role == "student"){
                                      students.add({
                                          user_key : s.id,
                                          student_id : `${d.getFullYear()}${d.getMilliseconds()}`,
                                          interest : '',
                                          semester : 1
                                      }).then(ss => {
                                          res.json({
                                              status : "success"
                                          })
                                      })
                                    } else if(req.params.role == "lecturer"){
                                      //add lecturer data
                                          lecturers.add({
                                              user_key: s.id,
                                              lecturer_id: `${d.getFullYear()}${d.getMilliseconds()}`,
                                              speciality: "-",
                                              publications: "-"
                                          }).then(ss => {
                                              res.json({
                                                  status: "success"
                                              });
                                          })
                                    }else{
                                        //role admin
                                    }

                                }
                            })
                        }
                    })
                  }
              }else{
                  res.json({
                    status : req.body.email + " already exists"
                  })
              }
          })
      })


  app.get("/logout", (req, res)=>{
    if(req.session.user && req.cookies.user_key){
      res.clearCookie("user_key")
    }
    res.redirect("/")
  })

}
