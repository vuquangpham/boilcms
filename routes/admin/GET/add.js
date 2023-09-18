const Type = require("../../../core/classes/utils/type");
const ComponentController = require("../../../core/classes/component/component-controller");
/**
 * Handle add action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleAddAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;

    const promise = Promise.resolve();
    const extraData = {};

    // load components information
    if(categoryItem.contentType === Type.types.POSTS){
        extraData.components = ComponentController.instances;
    }

    return [promise, extraData];
};

module.exports = handleAddAction;