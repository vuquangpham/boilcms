// dependencies
const path = require("path");

// config
const {ADMIN_URL, REGISTER_URL} = require("../../core/utils/config.utils");
const {sendEmptyToken} = require("../../core/utils/token.utils");
const {capitalizeString} = require("../../core/utils/helper.utils");

const Content = require("../../core/classes/utils/content")
const AccountType = require('../../core/classes/utils/account-type')


const handleGetMethod = (request, response, next) => {
    const type = response.locals.accountType.name;
    const token = response.locals.token
    // console.log('message in register: ', res.locals.message)

    // check if user logged and user want to log-out
    const logOutAction = AccountType.getActionType('log-out')
    if (token && type === logOutAction.name) {
        sendEmptyToken(response)
        return response.redirect(`/${REGISTER_URL}`);
    }

    // when user logged, can not redirect to register
    else if(token) return response.redirect(`/${ADMIN_URL}`);

    // capitalize pageTitle
    const pageTitle = capitalizeString(type,'-')

    // render html
    const directory = path.join(process.cwd(), 'views', 'register', 'type', `${type}` + '.ejs')
    Content.getHTML((directory),{type: type} )
        .then(html => {
            response.render('register/index', {
                content: html,
                title: pageTitle,
                message: response.locals.message || ''
            })
        })
        .catch(err => {
            console.error(err);
            next(err)
        })

}

module.exports = handleGetMethod;