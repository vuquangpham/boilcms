const Account = require('./../../core/classes/account/account')
const {sendAuthTokenAndCookies} = require("../../core/utils/token.utils");
const {ADMIN_URL, REGISTER_URL} = require("../../core/utils/config.utils");

const handlePostMethod = (request, response, next) => {
    const type = request.query.type;
    const hasJSON = response.locals.getJSON;
    let promise;

    switch (type) {
        case 'sign-up': {
            const data = Account.validateInputData(request)
            promise = Account.add(data)
            break;
        }
        case 'sign-in': {
            promise = Account.signIn(request)
        }
    }

    promise
        .then(result => {
            if (hasJSON) return response.status(200).json(result)

            // send token to client and save token in cookies
            sendAuthTokenAndCookies(result, type, response)

            // redirect to sign in when sign up

            // redirect to admin page
            if (type === 'sign-in') {
                response.redirect(`${ADMIN_URL}`)
            }

        })
        .catch(err => {
            request.app.set('message', err.message)
            response.redirect(`${REGISTER_URL}`)
        })
}

module.exports = handlePostMethod;