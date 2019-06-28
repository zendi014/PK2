var admin = require("firebase-admin");
var config = require("./fsconfig.json");
if (admin.apps.length > 0){
    admin.app();
}else{
    admin.initializeApp({
        credential: admin.credential.cert(config),
        databaseURL: "https://campus-app-umb.firebaseio.com"
    });
}
var db = admin.firestore();
db.settings({
    timestampsInSnapshots: true
});
module.exports = db;