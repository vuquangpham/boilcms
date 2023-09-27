const Type = require('../../../core/classes/utils/type');
const {stringToSlug} = require("../../../core/utils/helper.utils");
const PageBuilder = require('../../../core/database/page-builder/model');

/**
 * Handle add action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleAddAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    const data = categoryItem.validateInputData(request);

    const promise = categoryItem.add(data);
    const extraData = {};

    return [promise, extraData];
};


const validatePostType = (request) => {

};

module.exports = handleAddAction;