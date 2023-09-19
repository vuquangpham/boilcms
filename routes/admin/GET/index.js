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
    const hasJSON = response.locals.getJSON;

    if(!categoryItem) return response.redirect('/' + ADMIN_URL);

    // function for handling action
    let funcForHandlingAction = () => {
    };

    switch(action.name){
        case 'get':{
            funcForHandlingAction = handleGetAction;
            break;
        }
        case 'add':{
            funcForHandlingAction = handleAddAction;
            break;
        }
        case 'edit':{
            funcForHandlingAction = handleEditAction;
            break;
        }
    }

    const [promise, extraData] = funcForHandlingAction(request, response);

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