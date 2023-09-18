/**
 * Handle get action
 * @param {Object} categoryItem
 * @return {Array}
 * */
const handleGetAction = (categoryItem) => {
    const promise = categoryItem.getAllData();
    const extraData = {};

    return [promise, extraData];
};

module.exports = handleGetAction;