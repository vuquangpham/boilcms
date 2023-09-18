const Type = require("../../../core/classes/utils/type");
const ComponentController = require("../../../core/classes/component/component-controller");
/**
 * Handle edit action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleEditAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    const pageId = request.query.id;

    const promise = categoryItem.getDataById(pageId);
    const extraData = {};

    // load components information
    if(categoryItem.contentType === Type.types.POSTS){
        extraData.components = ComponentController.instances;
    }

    return [promise, extraData];
};

module.exports = handleEditAction;