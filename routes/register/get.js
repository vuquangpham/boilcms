const {ADMIN_URL, REGISTER_URL} = require("../../core/utils/config.utils");
const handleGetMethod = (req, res, next) => {
    const type = res.locals.accountType.name;
    const token = res.locals.token

    // check if user logged and user want to log-out
    if(token && type === 'log-out'){
        res.cookie('jwt', '', {
            maxAge: 5 * 1000,
            httpOnly: true
        })
        return res.redirect(`${REGISTER_URL}`)
    }
    // when user logged, can not redirect to register
    else if(token){
        return res.redirect(`${ADMIN_URL}`)
    }

    res.render(`register/${type}`,{
        type: type
    })
}

module.exports = handleGetMethod;