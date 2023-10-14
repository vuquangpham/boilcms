const jwt = require("jsonwebtoken");
const signToken = (userid) => {
    return jwt.sign({id: userid}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRED_IN
    })
}
const createSendToken = (user, statusToken, res) => {
    const token = signToken(user._id);

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