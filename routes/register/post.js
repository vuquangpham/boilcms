const User = require('../../core/categories/user')
const {sendAuthTokenAndCookies} = require("../../core/utils/token.utils");
const {ADMIN_URL, REGISTER_URL} = require("../../core/utils/config.utils");

const handlePostMethod = (request, response, next) => {
    const type = request.query.type;
    let promise;

    switch (type) {
        case 'sign-up': {
            const data = User.validateInputData(request)
            promise = User.add(data)
            break;
        }
        case 'sign-in': {
            promise = User.signIn(request)
        }
    }

    promise
        .then(result => {
            // redirect to admin page when sign in
            if (type === 'sign-in') {

                // send token to client and save token in cookies
                sendAuthTokenAndCookies(result, type, response)

                return response.redirect(`${ADMIN_URL}`)

            } else if (type === 'sign-up') {

                // redirect to sign in when sign up
                response.redirect(`${REGISTER_URL}`)
            }

        })
        .catch(err => {
            request.app.set('message', err.message)
            response.redirect(`${REGISTER_URL}`)
        })
}

module.exports = handlePostMethod;