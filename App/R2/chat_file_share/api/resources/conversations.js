
const fs = require('../sdk/fs.js');
const formidable = require('formidable');


const attr = [
    "to",
    "side",
    "message",
    "type",
    "file_name"
];

const parseParams = (params) => {
    let conv = {
        updated_at: new Date().getTime()
    };
    attr.forEach((a) => conv[a] = params[a]);
    return conv;
}

const init = () => {
    return {
        status: "sent",
        created_at: new Date().getTime()
    }
}

module.exports = {
    create(req, res) {
        const conv = Object.assign(init(), parseParams(req.body), {
            "from": req.session.user.user_key
        });        
        fs.collection('conversations').add(conv).then((s) => {
            res.status(201).json(conv);
        });
                
    },

    index(req, res) {
        let conversations = [];
        fs.collection('conversations')
            .orderBy("created_at")
            .get().then((s) => {
                s.forEach((doc) => {
                    if (
                        (doc.data().from == req.params.msg_to && doc.data().to == req.session.user.user_key) ||
                        (doc.data().to == req.params.msg_to && doc.data().from == req.session.user.user_key)
                    ) {
                        conversations.push(Object.assign(doc.data(), {
                            conversation_key: doc.id
                        }))
                    }
                })
                res.status(200).json(conversations)
            })
    },


    upload_file(req, res) {
        var form = new formidable.IncomingForm();
        form.parse(req);

        var path = './public/uploads/'
        form.on('fileBegin', function (name, file) {
            path = path + file.name;
            file.path = path;
        })
        form.on('file', function (name, file) {
            res.status(200).json({
                name: file.name,
                path: path
            });
        });
    }


}


