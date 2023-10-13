const handleGetMethod = (req, res, next) => {
    const type = req.query.type;
    res.render(`register/${type}`)
}

module.exports = handleGetMethod;