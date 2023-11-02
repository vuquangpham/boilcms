const jwt = require("jsonwebtoken");

/**
 * Create JWT token
 * @param id {string}
 * @return {Object}
 * */
const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRED_IN
    });
};

/**
 * If type is sign-in then sign JWT token for user, save token in cookie, else if type is sign-up send json for client
 * @param user {object}
 * @param type {String}
 * @param res
 * */
const sendAuthTokenAndCookies = (user, type, res) => {
    let token = signToken(user._id);

    const cookiesOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    res.cookie('jwt', token, cookiesOptions);
};

/**
 * Sending an empty token has a short lifespan of a few seconds when it is issued for authentication
 * @param res
 * */
const sendEmptyToken = (res) => {
    res.cookie('jwt', '', {
        maxAge: 5 * 1000,
        httpOnly: true
    });
};

module.exports = {
    signToken, sendAuthTokenAndCookies, sendEmptyToken
};