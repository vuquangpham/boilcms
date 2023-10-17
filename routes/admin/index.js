// dependencies
const router = require('express').Router();
const jwt = require('jsonwebtoken')

// config
const {REGISTER_URL} = require('./../../core/utils/config.utils')

// model
const User = require('./../../core/database/user/model')

// core modules
const CategoryController = require('../../core/classes/category/category-controller');

const Action = require('../../core/classes/utils/action');

// handle actions
const {getParamsOnRequest} = require("../../core/utils/helper.utils");
const handleGetMethod = require('./GET');
const handlePostMethod = require('./POST');

// handle upload action
const upload = require('../../core/utils/upload.utils');

/**
 * Middleware for authenticate user
 * */
router.all('*', async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if(!token){
            throw new Error('Token was not found')
        }
        // Verify token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY)

        // Check if the user still exists
        const currentUser = await User.findOne({_id: decoded.id}).select('+passwordChangedAt')
        if (!currentUser) {
            throw new Error('User is not exists')
        }

        // Check if the user changed password after the token was issued
        if (currentUser.hasAlreadyChangedPassword(decoded.iat)) {
            throw new Error('Password has changed recently')
        }

        // Does the account have the 'admin' role?
        if(currentUser.role !== 'admin'){
            throw new Error('You do not permission to access this data')
        }

        // Attach user information to req object to access user data throughout the application
        req.user = currentUser;

        next()

    }catch(err){
        console.error(err.message)
        res.redirect(`${REGISTER_URL}`)
    }
})

/**
 * Middleware for registering variables
 * */
router.all('*', (req, res, next) => {
    // params, default point to the dashboard page
    const [type] = getParamsOnRequest(req, ['default']);

    // queries
    const action = req.query.action;

    // categories
    res.locals.categories = CategoryController.instances;
    res.locals.categoryItem = CategoryController.getCategoryItem(type);
    res.locals.action = Action.getActionType(action);
    res.locals.params = {type};

    next();
});


/**
 * Dynamic page with file type
 * */
router.all('*', upload.single('image'), (request, response, next) => {
    const method = response.locals.method;

    switch (method.name) {
        case 'get': {
            handleGetMethod(request, response, next);
            break;
        }
        case 'post': {
            handlePostMethod(request, response, next);
        }
    }
});

module.exports = router;