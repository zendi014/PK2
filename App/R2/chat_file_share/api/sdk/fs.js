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




db.collection('conversations').onSnapshot(snap => {
  snap.docChanges().forEach(dt => {

    if (dt.type == "added") {

      io.emit("conversations", dt.doc.data());

    }

  });
});




module.exports = db;



















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
