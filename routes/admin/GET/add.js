const Type = require("../../../core/classes/utils/type");
const ComponentController = require("../../../core/classes/component/component-controller");
/**
 * Handle add action
 * @param {Object} categoryItem
 * @return {Array}
 * */
const handleAddAction = (categoryItem) => {
    const promise = Promise.resolve();
    const extraData = {};

    if(categoryItem.contentType === Type.types.POSTS){
        extraData.components = ComponentController.instances;
    }

    return [promise, extraData];
};

module.exports = handleAddAction;