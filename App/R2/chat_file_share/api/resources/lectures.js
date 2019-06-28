const fs = require('../sdk/fs.js');

const attr  = [
  "lecture_name",
  "mark",
  "room",
  "lecturer_key",
  "time",
  "code",
  "major",
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
    created_at: new Date().getTime()
  }
}


module.exports = {

    index(req, res) {
        let lectures = [];
        let a = 0;
        fs.collection('lectures').get().then((s) => {
          s.forEach((d) => {

            fs.collection('users')
              .doc(d.data().lecturer_key)
              .get().then((ss) => {
                  lectures.push(
                    Object.assign(
                      d.data(),
                      ss.data()
                    )
                  )
                  a++;
                  if(a == s.size){
                    res
                      .status(200)
                      .json(lectures)
                  }
              })

          });

        });
    },


    create(req, res) {
      const lecture = Object.assign(init(), parseParams(req.body));

      fs.collection('lectures').get().then((s) => {
          if(s.exists){
              res.status(201).json(lecture);
          }else{
              fs.collection('lectures').add(lecture).then((s) => {
                s.update({lecture_key: s.id});
                res.status(201).json(lecture);
              });
          }
      });
    },



    update(req, res) {//delete here
        const lecture = parseParams(req.body);
        fs.collection('lectures').doc(req.params.lid).update(lecture).then((s) => {
          res.status(201).json(lecture);
        });
    },


    show(req, res) {
        fs.collection('lectures')
          .doc(req.params.lid)
          .get().then((doc) => {
              if (doc.exists) {
                fs.collection('users')
                  .doc(doc.data().lecturer_key)
                  .get().then((ss) => {
                      res
                        .status(200)
                        .json(Object.assign(doc.data(), ss.data()))
                })
              } else {
                res
                  .status(404)
              }
        });
    },

}
