const fs = require('../sdk/fs.js');

const attr  = [
  "lecturer_name",
  "email",
  "interest"
];


const parseParams = (params)=> {
  let lecture = {
    updated_at: new Date().getTime()
  };

  attr.forEach((a)=> lecture[a] = params[a]);

  return lecture;
}


const init = ()=> {
  return {
    is_deleted: "0",
    created_at: new Date().getTime()
  }
}


module.exports = {
  index(req, res) {
      let lecturer = [];
      let a = 0;
      fs.collection('users')
        .where("role", "==", "lecturer")
        .get().then((s) => {
            s.forEach((doc) => {
              
                fs.collection('lecturers')
                  .where("user_key", "==", doc.id)
                  .get().then((ss) => {
                      lecturer.push(
                        Object.assign(
                          doc.data(),
                          {
                            "publications": ss.docs[0].data().publications,
                            "speciality": ss.docs[0].data().speciality,
                            "lecturer_id": ss.docs[0].data().lecturer_id,
                            "user_key": doc.id,
                          }
                        )
                      )
                      a++;
                      if(a == s.size){
                        res
                          .status(200)
                          .json(lecturer)
                      }
                  })
            });

      });
  },


  create(req, res) {
    const lecturer = Object.assign(init(), parseParams(req.body));

    fs.collection('lecturer').where("email", "==", req.body.email).get().then((s) => {
        if(s.exists){
            res.status(201).json(lecturer);
        }else{
            fs.collection('lecturer').add(lecturer).then((s) => {
              s.update({lecturer_key: s.id});
              res.status(201).json(lecturer);
            });
        }
    });
  },


  update(req, res) {//delete here
      const lecturer = parseParams(req.body);
      fs.collection('lecturer').doc(req.params.lid).update(lecturer).then((s) => {
        res.status(201).json(lecturer);
      });
  },


  show(req, res) {
      fs.collection('lecturer').doc(req.params.lid).get().then((doc) => {
        if (doc.exists) {
          res
            .status(200)
            .json(doc.data())
        } else {
          res
            .status(404)
        }
      });
  },
}
