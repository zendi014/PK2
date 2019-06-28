module.exports = {
    index(req, res){
        data = {
            title           : "Lecturer",
            name            : 'Universitat',
        }
        res.render('./main/lecturer', data);
    },


    form_lecturer(req, res){
        data = {
            title           : "Lecturer",
            name            : 'Universitat',
            lr_id           : req.body.lr_id
        }
        res.render('./partials/form_lecturer', data);
    },

    table_lecturer(req, res){
        data = {
            title           : "Lecturer",
            name            : 'Universitat',
        }
        res.render('./partials/table_lecturer', data);
    },

}
