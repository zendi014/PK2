var md5 = require("md5");
const fs = require('../api/sdk/fs.js');


var fadmin = require("firebase-admin");
var service_account = require("../api/sdk/campus-app-umb.json")

var db = fadmin.firestore();

if (fadmin.apps.length > 0) {
    fadmin.app();
} else {
    fadmin.initializeApp({
        credential: fadmin.credential.cert(service_account),
        databaseURL: "https://campus-app-umb.firebaseio.com"
    })
    db.settings({
        timestampsInSnapshots: true
    });
}



const FirebaseAuth = require('firebaseauth');
const fsa = new FirebaseAuth("AIzaSyDl2GPRcs72cTxMjx0d9e0MDuQjif-OM10");
//https://www.npmjs.com/package/firebaseauth




let users = db.collection('users');
let students = db.collection('students');
let lecturers = db.collection('lecturers');




module.exports = function (app) {







    app.use((req, res, next) => {
        if (req.cookies.user_key && !req.session.user) {
            res.clearCookie('user_key');
        }
        next();
    });







    // middleware function to check for logged-in users
    var sessionChecker = (req, res, next) => {
        if (req.session.user && req.cookies.user_key) {
            if (req.session.user.role == 'student') {
                res.redirect('/student');
            } else if (req.session.user.role == 'lecturer') {
                res.redirect('/lecturer');
            }else{
                res.redirect('/admin');
            }
            // next();
        } else {
            next();
            // res.redirect('/sign_in');
        }
    };









    // route for Home-Page
    app.get('/', sessionChecker, (req, res) => {
        res.redirect('/login');
    });






    app.route('/login')
        .get(sessionChecker, (req, res) => {
            data = {
                title: "Login",
                name: 'University App'
            }
            res.render('./main/login', data);
        }).post((req, res) => {
            fsa.signInWithEmail(req.body.email, md5(req.body.password), function (e, r) {
                if (e) {
                    res.json(e);
                } else {
                    users.where("email", "==", req.body.email).get().then((s) => {
                        s.forEach((doc) => {
                            req.session.user = Object.assign(doc.data(), {
                                "user_key": doc.id
                            });
                            // console.log(req.session.user)
                            res.json({
                                status: 'success'
                            });
                        });
                    });
                }
            })
        })








    app.route('/register/:role')
        .get(sessionChecker, (req, res) => {
            data = {
                title: "Register",
                name: 'University App',
                role: req.params.role
            }
            res.render('./main/register', data);
        }).post((req, res) => {
            fsa.signInWithEmail(req.body.email, md5(req.body.password), function (e, r) {
                if (e) {
                    if (e.code == 'EMAIL_NOT_FOUND') {
                        fadmin.auth().createUser({
                            email: req.body.email,
                            password: md5(req.body.password),
                            displayName: req.body.full_name
                        }).then(function (userRecord) {
                            // console.log(userRecord)
                            if (userRecord) {
                                users.add({
                                    email: req.body.email,
                                    displayName: req.body.full_name,
                                    phone: req.body.phone,
                                    role: req.params.role,
                                    major: req.body.major,
                                }).then(s => {
                                    if (s) {
                                        let d = new Date()
                                        if (req.params.role == "student") {
                                            //add student data
                                            students.add({
                                                user_key: s.id,
                                                student_id: `${d.getFullYear()}${d.getMonth()}${d.getMilliseconds()}`,
                                                interest: "-",
                                                semester: 1
                                            }).then(ss => {
                                                res.json({
                                                    status: "success"
                                                });
                                            })
                                        } else {
                                            //add lecturer data
                                            lecturers.add({
                                                user_key: s.id,
                                                lecturer_id: `${d.getFullYear()}${d.getMonth()}${d.getMilliseconds()}`,
                                                speciality: "-",
                                                publications: "-"
                                            }).then(ss => {
                                                res.json({
                                                    status: "success"
                                                });
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    }
                } else {
                    res.json({
                        status: req.body.email + " already exits"
                    });
                }
            })
        });



    // route for user logout
    app.get('/logout', (req, res) => {
        if (req.session.user && req.cookies.user_key) {
            res.clearCookie('user_key');
        }

        res.redirect('/');
    });
}
