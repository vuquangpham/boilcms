const Content = require('../../../core/classes/utils/content');
const {ADMIN_URL} = require("../../../core/utils/config.utils");

const handleAddAction = require('./add');
const handleGetAction = require('./get');
const handleEditAction = require('./edit');

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
    const hasJSON = response.locals.hasJSON;

    if(!categoryItem) return response.redirect('/' + ADMIN_URL);

    // promise
    let promise = Promise.resolve();
    let extraData = {};

    switch(action.name){
        case 'get':{
            [promise, extraData] = handleGetAction(categoryItem);
            break;
        }
        case 'add':{
            [promise, extraData] = handleAddAction(categoryItem);
            break;
        }
        case 'edit':{
            [promise, extraData] = handleEditAction(categoryItem, request.query.id);
            break;
        }
    }

    // render data
    promise
        .then(result => {
            const data = {
                data: result,
                title: categoryItem.name,
                contentType: categoryItem.contentType.name,
                actionType: action.name,
                type: categoryItem.type,
                ...extraData
            };

            if(hasJSON) return response.status(200).json(data);

            // render html to fe
            Content.getContentByType(categoryItem.contentType.name, action, data)
                .then(html => {
                    response.render('admin', {
                        content: html,
                    });
                });
        })
        .catch(err => {
            console.error(err);
            next(err);
        });
};

module.exports = handleGetMethod;