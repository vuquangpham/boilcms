const Account = require('./../../core/classes/account/account')
const {sendAuthTokenAndCookies} = require("../../core/utils/token.utils");
const {ADMIN_URL, REGISTER_URL} = require("../../core/utils/config.utils");

const handlePostMethod = (req, res, next) => {
    const account = new Account();

    const type = req.query.type;
    const hasJSON = res.locals.getJSON;
    let promise;

    switch (type) {
        case 'sign-up': {
            const data = account.validateInputData(req)
            promise = account.add(data)
            break;
        }
        case 'sign-in': {
            promise = account.signIn(req)
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
            // res.locals.message = err.message;
            // console.log('message: ', res.locals.message)
            res.redirect(`${REGISTER_URL}`)
            console.error(err);
            next(err)
        })
}

module.exports = handlePostMethod;