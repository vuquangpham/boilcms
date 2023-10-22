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
    response.locals.accountType = AccountType.getValidatedAccountType(accountType);

    next();
}

/**
 * Check user authentication
 * */
const checkAuthentication = (request, response) => {
    return new Promise((resolve, reject) => {
        let token = request.cookies.jwt;

        // Check token exists
        if (!token) {
            reject(new Error('Token was not found'));
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                reject(err);
            }
            User.findOne({_id: decoded.id})
                .then(currentUser => {
                    if (!currentUser) {
                        reject(new Error('User does not exist'));
                    } else {
                        // Check if the user changed password after the token was issued
                        if (currentUser.hasAlreadyChangedPassword(decoded.iat)) {
                            reject(new Error('Password has changed recently'));
                        }

                        response.locals.user = currentUser;
                        resolve();
                    }
                })
                .catch(err => {
                    reject(err);
                });
        })
    })
}

/**
 * Restrict user access based on their roles.
 * @param request
 * @param response
 * @param role {array} - An array of role allowed to access
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
    globalMiddleware, checkAuthentication, restrictTo
}