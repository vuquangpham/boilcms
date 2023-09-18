/**
 * Handle edit action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleEditAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    const requestBodyData = request.body;
    const pageId = request.query.id;

    const promise = categoryItem.databaseModel.findOneAndUpdate({_id: pageId}, requestBodyData);
    const extraData = {};

    return [promise, extraData];
};

module.exports = handleEditAction;