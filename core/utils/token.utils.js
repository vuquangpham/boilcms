const jwt = require("jsonwebtoken");
const signToken = (userid) => {
    return jwt.sign({id: userid}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRED_IN
    })
}
const createSendToken = (user, statusToken, type, res) => {
    let token = signToken(user._id);

    // if type = sign up, don't send token
    if(type === 'sign-up'){
        token = undefined
    }

    const cookiesOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    res.cookie('jwt', token, cookiesOptions)

    // Remove password from output
    user.password = undefined

    res.status(statusToken).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

module.exports = {
    signToken, createSendToken
}