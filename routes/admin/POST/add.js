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
    let requestBodyData = request.body;

    // validate type
    switch(categoryItem.contentType){
        case Type.types.POSTS:{
            requestBodyData = validatePostType(request);
            break;
        }
    }

    const promise = categoryItem.add(requestBodyData);
    const extraData = {};

    return [promise, extraData];
};


const validatePostType = (request) => {
    const title = request.body.title.trim();
    const url = stringToSlug(title);
    const visibility = request.body.visibility.trim();
    const content = new PageBuilder({
        content: request.body.content.trim()
    });

    // save to database
    content.save();

    return {
        title,
        url,
        visibility,
        content
    };
};

module.exports = handleAddAction;