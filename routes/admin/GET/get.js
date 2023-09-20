const ComponentController = require("../../../core/classes/component/component-controller");
/**
 * Handle get action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleGetAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    const component = ComponentController.getComponentBasedOnName(request.query.componentName);

    const promise = component ? Promise.resolve(ComponentController.getHTML(component)) : categoryItem.getAllData();
    const extraData = {};

    if(component) extraData.component = component;

    return [promise, extraData];
};

module.exports = handleGetAction;