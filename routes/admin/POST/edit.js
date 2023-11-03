/**
 * Handle edit action
 * @param {Object} request
 * @param {Object} response
 * @return {Array}
 * */
const handleEditAction = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    const inputData = {request, response};
    const data = categoryItem.validateInputData(inputData, 'edit');
    const id = request.query.id;
    let promise

    // if user change edit password
    if (categoryItem.name === 'User' && data.password !== undefined) {
        promise = categoryItem.updatePassword(id, inputData)
    } else {
        promise = categoryItem.update(id, data);
    }

    const extraData = {};

    return [promise, extraData];
};

module.exports = handleEditAction;