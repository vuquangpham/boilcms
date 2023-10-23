// dependencies
const path = require("path");

// config
const {ADMIN_URL, REGISTER_URL} = require("../../core/utils/config.utils");
const {sendEmptyToken} = require("../../core/utils/token.utils");
const {capitalizeString} = require("../../core/utils/helper.utils");

const Content = require("../../core/classes/utils/content")
const AccountType = require('../../core/classes/utils/account-type')


const handleGetMethod = async (req, res, next) => {
    const type = res.locals.accountType.name;
    const token = res.locals.token
    // console.log('message in register: ', res.locals.message)

    // check if user logged and user want to log-out
    if (token && AccountType.getActionType('LOGOUT')) {
        sendEmptyToken(res)
        return res.redirect(`/${REGISTER_URL}`);
    }

    // when user logged, can not redirect to register
    else if(token) return res.redirect(`/${ADMIN_URL}`);

    // capitalize pageTitle
    const pageTitle = capitalizeString(type,'-')

    // render html
    const directory = path.join(process.cwd(), 'views', 'register', 'type', `${type}` + '.ejs')
    const html = await Content.getHTML(directory, {type: type})

    res.render('register/index', {
        content: html,
        title: pageTitle,
        message: res.locals.message || ''
    })
    
}

module.exports = handleGetMethod;