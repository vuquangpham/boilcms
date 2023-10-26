const AccountType = require('../classes/utils/account-type');
const Method = require('../classes/utils/method')
const jwt = require("jsonwebtoken");
const User = require("../database/user/model");

/**
 * middleware for all routing
 * */
const globalMiddleware = (request, response, next) => {
    // project name
    response.locals.projectName = 'BoilCMS';

    // queries
    const method = request.query.method;
    const getJSON = request.query.getJSON;
    const accountType = request.query.type;

    // get token
    const token = request.cookies.jwt;

    // assign variables to locals
    response.locals.method = Method.getValidatedMethod(method);
    response.locals.getJSON = getJSON;
    response.locals.token = token;

    // get account type
    response.locals.accountType = AccountType.getActionType(accountType);

    next();
}

/**
 * Check user authentication
 * */
const authenticateUser = (request, response, next) => {
    let token = request.cookies.jwt;

    // Check token exists
    if (!token) {
        response.locals.user = undefined
        return next()
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error(err)
            return next(err)
        }
        User.findOne({_id: decoded.id})
            .then(currentUser => {
                if (!currentUser || currentUser.hasAlreadyChangedPassword(decoded.iat)) {
                    response.locals.user = undefined
                } else {
                    response.locals.user = currentUser;
                }
                next()
            })
            .catch(err => {
                response.locals.user = undefined
                next()

            })
    })
}

/**
 * Restrict user access based on their roles.
 * @param request
 * @param response
 * @param role {Array | String} - An array of role allowed to access
 * @return {Promise}
 * */
// Middleware restrict
const restrictTo = (request, response, ...role) => {
    return new Promise((resolve, reject) => {
        if (!role.includes(response.locals.user.role)) {
            reject(new Error('You do not permission to access'))
        }
        resolve()
    })
}

module.exports = {
    globalMiddleware, authenticateUser, restrictTo
}