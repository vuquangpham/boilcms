const Type = require("../../../core/classes/utils/type");
const ComponentController = require("../../../core/classes/component/component-controller");
/**
 * Handle edit action
 * @param {Object} categoryItem
 * @param {String} pageId
 * @return {Array}
 * */
const handleEditAction = (categoryItem, pageId) => {
    const promise = categoryItem.getDataById(pageId);
    const extraData = {};

    if(categoryItem.contentType === Type.types.POSTS){
        extraData.components = ComponentController.instances;
    }

    return [promise, extraData];
};

module.exports = handleEditAction;