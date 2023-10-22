// dependencies
const router = require('express').Router();

// config
const {REGISTER_URL} = require('./../../core/utils/config.utils')
const {sendEmptyToken} = require("../../core/utils/token.utils");
const {checkAuthentication, restrictTo} = require("../../core/utils/middleware.utils");

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
router.all('*', (req, res, next) => {
    checkAuthentication(req, res)
        .then(() => restrictTo(req, res, 'admin'))
        .then(() => next())
        .catch((err) => {
            console.error(err.message);
            res.locals.message = err.message;
            sendEmptyToken(res);
            return res.redirect(`/${REGISTER_URL}`);
        });
});

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