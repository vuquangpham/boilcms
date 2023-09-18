/**
 * Handle get action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleGetAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;

    const promise = categoryItem.getAllData();
    const extraData = {};

    return [promise, extraData];
};

module.exports = handleGetAction;