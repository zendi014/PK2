var firebase = require("firebase-admin");
var service_account = require("./campus-app-umb.json")

if (firebase.apps.length > 0) {
  firebase.app();
} else {
  firebase.initializeApp({
    credential: firebase.credential.cert(service_account),
    databaseURL: "https://campus-app-umb.firebaseio.com"
  });
}

var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

module.exports = db;



/*
notification.onSnapshot(Doc => {
    Doc.docChanges().forEach(dt => {
     if (dt.type=="added"){
        pusher.trigger('notification', 'added',  dt.doc.data());
      }
    });
});
*/



const io = require('socket.io')();

io.on('connection', function (socket) {

  socket.on('connection', function (data) {
    io.emit("message", data); //push data to webapp
    console.log(data)
  });

  socket.on('disconnect', function (data) {
    console.log(data);
  });
})
io.listen(2000);



















/*
var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '779153',
  key: 'a76272e8741bb3e506b0',
  secret: '88dca501bd8ef8e2d71f',
  cluster: 'mt1',
  encrypted: true
});



// pusher.trigger('my-channel', 'my-event', {
//   "message": "hello world"
// });

pusher.trigger('private-my-channel', 'snapshot', {
  "message": "snapshot data"
});
//https://dashboard.pusher.com/
// https://github.com/pusher/pusher-js
*/
