/**
 * Handle add action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleAddAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    const requestBodyData = request.body;

    const promise = categoryItem.add(requestBodyData);
    const extraData = {};

    return [promise, extraData];
};

module.exports = handleAddAction;