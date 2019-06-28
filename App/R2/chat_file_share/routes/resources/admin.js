module.exports = {
    index(req, res){
        data = {
            title           : "Admin Dashboard",
            name            : 'Universitat',
        }
        res.render('./main/admin', data);
    },

}
