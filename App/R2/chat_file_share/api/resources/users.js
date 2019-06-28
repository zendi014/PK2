
const fs = require('../sdk/fs.js');

module.exports = {
    index(req, res) {
        let users = [];

        fs.collection('users')
            .where("role", "==", "student") //req.session.user.role
            .get().then((s) => {
                s.forEach((doc) => {
                    if (doc.id != req.session.user.user_key){
                        users.push(Object.assign(doc.data(), {
                            user_key: doc.id
                        }))
                    }                    
                })
                res.status(200).json(users)
            })
    },

    detail(req, res) {
        fs.collection('users')
            .doc(req.params.ukey)            
            .get().then((s) => {
                res.status(200).json(Object.assign(s.data(), {
                    user_key: s.id
                }))
            })
    }
}


