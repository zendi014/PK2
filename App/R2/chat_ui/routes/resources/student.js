module.exports = {

    index(req, res) {
        data = {
            title: "Student",
            name: 'Universitat',
            user_data: req.session.user
        }
        res.render('./main/student', data);
    },

}