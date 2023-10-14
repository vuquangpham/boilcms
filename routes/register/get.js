const handleGetMethod = (req, res, next) => {
    const type = req.query.type;

    res.render(`register/${type}`,{
        type: type
    })
}

module.exports = handleGetMethod;