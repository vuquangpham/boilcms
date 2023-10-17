const jwt = require("jsonwebtoken");
const signToken = (userid) => {
    return jwt.sign({id: userid}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRED_IN
    })
}

/**
 * If type is sign-in then sign JWT token for user, save token in cookie, else if type is sign-up send json for client
 * @param user {object}
 * @param type {String}
 * @param res
 * */
const sendAuthTokenAndCookies = (user, type, res) => {
    let token

    // if type = sign in, create token
    if (type === 'sign-in') {
        token = signToken(user._id);
    }

    const cookiesOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    res.cookie('jwt', token, cookiesOptions)
};

module.exports = {
    signToken, sendAuthTokenAndCookies
}