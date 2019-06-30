const fs = require('../sdk/fs.js');

function add_log_files(file_data) {
    console.log(file_data)
    return new Promise(function (resolve, reject) {
        fs.collection('log_files')
            .add(file_data).then((s) => {
                if (s) {
                    resolve(s)
                }
            })
    })
}
function get_log_files(){
    return new Promise(function (resolve, reject) {
        fs.collection('log_files')
            .get().then((s) => {
                let dt = [];
                s.forEach((v)=>{
                    dt.push(v.data())
                })
                if (s) {
                    resolve(dt)
                }
            })
    })
}
module.exports = {
    add_log_files: add_log_files,
    get_log_files: get_log_files
}