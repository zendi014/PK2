module.exports = {
    index(req, res){
        data = {
            title           : "Lectures",
            name            : 'Universitat',
        }
        res.render('./main/lectures', data);
    },

    form_lectures(req, res){
        res.render('./partials/form_lectures', {lid: req.params.lid});
    },
}
