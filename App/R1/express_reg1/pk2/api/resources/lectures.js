module.exports = {
    read(req, res) {
        res.status(201).json("api lectures read")
    },
    update(req, res) {
        res.status(201).json("api lectures update")
    },
    create(req, res) {
        res.status(201).json("api lectures create")
    },
    delete(req, res) {
        res.status(201).json("api lectures delete")
    },
};