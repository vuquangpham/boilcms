const ComponentController = require("../../../core/classes/component/component-controller");

const handleGetAction = require('./get');
const handleAddAction = require('./add');
const handleEditAction = require('./edit');

/**
 * Handle POST method
 * @param {Object} request
 * @param {Object} response
 * @param {NextFunction} next
 * @return {void}
 * */
const handlePostMethod = (request, response, next) => {
    const action = response.locals.action;
    const hasJSON = response.locals.hasJSON;

    // promise
    let promise = Promise.resolve();
    let extraData = {};

    // handle component information
    const component = ComponentController.getComponentBasedOnName(request.body.componentName);

    switch(action.name){
        case 'get':{
            [promise, extraData] = handleGetAction(request, response);
            break;
        }
        case 'add':{
            [promise, extraData] = handleAddAction(request, response);
            break;
        }
        case 'edit':{
            [promise, extraData] = handleEditAction(request, response);
        }
    }

    promise
        .then(result => {
            // return JSON
            if(component && hasJSON) return response.status(200).json({content: result, component: component});

            if(hasJSON) return response.status(200).json(result);

            // redirect to page
            response.redirect(action.name === 'edit' ? request.get('referer') : request.params.type);
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
};

module.exports = handlePostMethod;