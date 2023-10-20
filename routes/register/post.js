const Account = require('./../../core/classes/account/account')
const {sendAuthTokenAndCookies} = require("../../core/utils/token.utils");
const {ADMIN_URL, REGISTER_URL} = require("../../core/utils/config.utils");

const handlePostMethod = (req, res, next) => {
    const type = req.query.type;
    const hasJSON = res.locals.getJSON;
    let promise;

    switch (type) {
        case 'sign-up': {
            const data = Account.validateInputData(req)
            promise = Account.add(data)
            break;
        }
        case 'sign-in': {
            promise = Account.signIn(req)
        }
    }

    promise
        .then(result => {
            if (hasJSON) return res.status(200).json(result)

            // send token to client and save token in cookies
            sendAuthTokenAndCookies(result, type, res)

            // redirect to sign in when sign up

            // redirect to admin page
            if (type === 'sign-in') {
                res.redirect(`${ADMIN_URL}`)
            }

        })
        .catch(err => {
            res.redirect(`${REGISTER_URL}`)
            console.error('err: ',err);
        })
}

module.exports = handlePostMethod;