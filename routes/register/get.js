const {ADMIN_URL} = require("../../core/utils/config.utils");
const handleGetMethod = (req, res, next) => {
    const type = res.locals.accountType.name;
    const token = res.locals.token

    if(token){
        return res.redirect(`${ADMIN_URL}`)
    }

    // if(type === 'log-out'){
    //     console.log(type)
    // }
    res.render(`register/${type}`,{
        type: type
    })
}

module.exports = handleGetMethod;