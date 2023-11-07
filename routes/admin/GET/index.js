const Content = require('../../../core/classes/utils/content');
const {ADMIN_URL} = require("../../../core/utils/config.utils");

const handleAddAction = require('./add');
const handleGetAction = require('./get');
const handleEditAction = require('./edit');

const User = require('../../../core/categories/user')
const {restrictTo} = require("../../../core/utils/middleware.utils");

/**
 * Handle GET method
 * @param {Object} request
 * @param {Object} response
 * @param {NextFunction} next
 * @return {void | *}
 * */
const handleGetMethod = (request, response, next) => {
    const categoryItem = response.locals.categoryItem;
    const action = response.locals.action;
    const hasJSON = response.locals.getJSON;

    if (!categoryItem || !restrictTo(response, categoryItem.acceptRole)) {
        return response.redirect('/' + ADMIN_URL);
    }

    // function for handling action
    let funcForHandlingAction = () => {
    };

    // get custom post type
    const isCustomType = categoryItem.contentType.isCustomType;

    // custom type
    if (!isCustomType) {
        switch (action.name) {
            case 'get': {
                funcForHandlingAction = handleGetAction;
                break;
            }
            case 'add': {
                funcForHandlingAction = handleAddAction;
                break;
            }
            case 'edit': {
                funcForHandlingAction = handleEditAction;
                break;
            }
        }
    }

    const [promise, extraData] = isCustomType ? [User.find(response.locals.user._id), {}] : funcForHandlingAction(request, response);

    // render data
    promise
        .then(result => {
            const data = {
                data: result,
                title: categoryItem.name,
                contentType: categoryItem.contentType.name,
                actionType: action.name,
                type: categoryItem.type,
                isSpecialType: categoryItem.isSpecialType,
                ...extraData
            };

            if (hasJSON) return response.status(200).json(data);

            const pageTitle = categoryItem.name[0].toUpperCase() + categoryItem.name.slice(1);

            // render html to fe
            Content.getContentByType(categoryItem.contentType.name, action, data)
                .then(html => {
                    response.render('admin', {
                        content: html,
                        title: pageTitle,
                        data
                    });
                });
        })
        .catch(err => {
            console.error(err);
            next(err);
        });
};

module.exports = handleGetMethod;