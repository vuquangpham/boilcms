/**
 * Handle edit action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleEditAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    const data = categoryItem.validateInputData(request,response, 'edit');
    const id = request.query.id;

    const promise = categoryItem.update(id, data);
    const extraData = {};

    return [promise, extraData];
};

module.exports = handleEditAction;