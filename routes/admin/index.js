// dependencies
const router = require('express').Router();

// config
const {REGISTER_URL} = require('./../../core/utils/config.utils');
const {sendEmptyToken} = require("../../core/utils/token.utils");
const {restrictTo} = require("../../core/utils/middleware.utils");

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
router.all('*', (request, response, next) => {

    restrictTo(request, response, 'admin')
        .then(next)
        .catch((err) => {
            request.app.set('message', err.message)

            sendEmptyToken(response)

            response.redirect(`/${REGISTER_URL}`);
        })
})

/**
 * Middleware for registering variables
 * */
router.all('*', (request, response, next) => {
    // params, default point to the dashboard page
    const [type] = getParamsOnRequest(request, ['default']);

    // queries
    const action = request.query.action;

    // categories
    response.locals.categories = CategoryController.instances;
    response.locals.categoryItem = CategoryController.getCategoryItem(type);
    response.locals.action = Action.getActionType(action);
    response.locals.params = {type};

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