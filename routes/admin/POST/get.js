const ComponentController = require("../../../core/classes/component/component-controller");

/**
 * Handle get action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleGetAction = (request, response) => {
    const component = ComponentController.getComponentBasedOnName(request.body.componentName);

    const promise = component ? ComponentController.getHTML(component) : Promise.resolve();
    const extraData = {};

    return [promise, extraData];
};

module.exports = handleGetAction;