const Account = require('./../../core/classes/account/account')
const {createSendToken} = require("../../core/utils/token.utils");
const handlePostMethod = (req, res, next) => {
    const account = new Account();
    const type = req.query.type
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
            createSendToken(result, 200, type, res)
        })
        .catch(err => {
            console.error(err);
            next(err)
        })
}

module.exports = handlePostMethod;