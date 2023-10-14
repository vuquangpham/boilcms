const Account = require('./../../core/classes/account/account')
const {createSendToken} = require("../../core/utils/token.utils");
const handlePostMethod = (req, res, next) => {
    const account = new Account();
    const data = account.validateInputData(req)

    const promise = account.add(data)

    promise
        .then(result => {
            createSendToken(result, 200, res)
        })
        .catch(err => {
            console.error(err);
            next(err)
        })
}

module.exports = handlePostMethod;