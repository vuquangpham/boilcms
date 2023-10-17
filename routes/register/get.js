const handleGetMethod = (req, res, next) => {
    const type = res.locals.accountType.name;

    res.render(`register/${type}`,{
        type: type
    })
}

module.exports = handleGetMethod;