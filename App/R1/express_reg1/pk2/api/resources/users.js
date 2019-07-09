let db = require('../sdk/connection');
let users = db.collection("users");

module.exports = {

    read(req, res){
        var udt = [];
        users.get().then( (s) => {
            s.forEach((dt) => {
                udt.push(dt.data());
            })
            res.status(201).json(udt)
        })
    },

    detail(req, res){
        users.doc(req.params.user_key)
            .get().then((s) => {
                res.status(201).json(s.data())
        })
    },

    create(req, res) {
        let user = {
            "user_key": "",
            "full_name": req.body.first_name+" "+req.body.last_name,
            "email": req.body.email,
            "address": req.body.address,
            "phone": req.body.phone,
            "major": req.body.major,
            "religion": req.body.religion,
            "status": req.body.status,
        }
        users.add( user ).then((s) => {
           s.update({user_key : s.id});
            res.status(201).json(user)
        })
    },

    update(req, res) {
        let user = {
            "user_key": "",
            "full_name": req.body.full_name,
            "email": req.body.email,
            "address": req.body.address,
            "phone": req.body.phone,
            "major": req.body.major,
            "religion": req.body.religion,
            "status": req.body.status,
        }
        users.doc(req.body.user_key).update(user).then((s) => {
            res.status(201).json(user)
        })
    },

    delete(req, res) {
        users.doc(req.body.user_key).delete().then((s) => {
            res.status(201).json(req.body.user_key)
        })
    },
};