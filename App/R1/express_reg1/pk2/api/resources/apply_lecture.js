module.exports = {
    read(req, res) {
        res.status(201).json("api apply lectures read")
    },
    update(req, res) {
        res.status(201).json("api apply lectures update")
    },
    create(req, res) {
        res.status(201).json("api apply lectures create")
    },
    delete(req, res) {
        res.status(201).json("api apply lectures delete")
    },
};