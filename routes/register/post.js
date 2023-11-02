const User = require('../../core/categories/user')

// config
const {sendAuthTokenAndCookies} = require("../../core/utils/token.utils");
const {ADMIN_URL, REGISTER_URL, RESET_PASSWORD_URL} = require("../../core/utils/config.utils");
const {splitUrl} = require("../../core/utils/helper.utils");

const handlePostMethod = (request, response, next) => {
    const type = request.query.type;
    const resetUrlToken = request.query.token
    const inputData = {request, response};
    let promise;

    switch (type) {
        case 'sign-up': {
            const data = User.validateInputData(inputData)
            promise = User.add(data)
            break;
        }
        case 'sign-in': {
            promise = User.signIn(request)
            break;
        }
        case 'forget-password': {
            promise = User.forgetPassword(request)
            break;
        }
        case 'reset-password': {
            promise = User.resetPassword(request, resetUrlToken)
        }
    }

    promise
        .then(result => {
            // clear error message
            request.app.set('message', '')

            // redirect to admin page when sign in
            if (type === 'sign-in') {

                // send token to client and save token in cookies
                sendAuthTokenAndCookies(result, type, response)

                response.redirect(`${ADMIN_URL}`)

            } else if (type === 'sign-up') {

                // redirect to sign in when sign up
                response.redirect(`${REGISTER_URL}`)

            } else if (type === 'forget-password') {

                response.redirect(`${REGISTER_URL}?type=${RESET_PASSWORD_URL}&token=${result}`)

            } else if (type === 'reset-password') {

                response.redirect(`${REGISTER_URL}`)
            }

        })
        .catch(err => {
            request.app.set('message', err.message)

            // reload current page if have error when post
            if(type === 'sign-in'){
                response.redirect(`${REGISTER_URL}`)

            } else if(type === 'sign-up' || type === 'forget-password'){
                response.redirect(`${splitUrl(request.originalUrl,0, 1, '&')}`)

            } else if(type === 'reset-password'){
                response.redirect(`${splitUrl(request.originalUrl,0, 2, '&')}`)
            }
        })
}

module.exports = handlePostMethod;