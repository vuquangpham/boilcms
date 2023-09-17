const {ADMIN_URL} = require("../../core/utils/config.utils");
const Type = require("../../core/classes/utils/type");
const ComponentController = require("../../core/classes/component/component-controller");
const Content = require("../../core/classes/utils/content");

/**
 * Handle get request
 * @param {Object} request
 * @param {Object} response
 * @return {void | *}
 * */
const handleGetRequest = (request, response) => {
    const categoryItem = response.locals.categoryItem;
    const action = response.locals.validatedAction;
    const hasJSON = response.locals.hasJSON;

    if(!categoryItem) return response.redirect('/' + ADMIN_URL);

    // promise
    const pageId = request.query.id;
    const isAddPage = request.query.state === 'add';
    const isDetailPage = pageId || isAddPage;

    console.log(isAddPage);

    let promise = Promise.resolve();
    if(isDetailPage && !isAddPage) promise = categoryItem.getDataById(pageId);
    if(!isDetailPage) promise = categoryItem.getAllData();

    // data based on action or category type
    const extraData = {};

    // handle extra data based on posts_type
    handleGetRequestOnPostDetail(request, response, extraData);

    // render data
    promise
        .then(result => {
            const data = {
                data: result,
                title: categoryItem.name,
                contentType: categoryItem.contentType.name,
                actionType: action.name,
                type: categoryItem.type,
                ...extraData
            };

            if(hasJSON) return response.status(200).json(data);

            // render html to fe
            Content.getContentByType(categoryItem.contentType.name, action, data)
                .then(html => {
                    response.render('admin', {
                        content: html,
                    });
                });
        })
        .catch(err => {
            console.error(err);
        });
};


/**
 * Handle get request on POST DETAIL
 * @param {Object} request
 * @param {Object} response
 * @param {Object} extraData
 * @return {void}
 * */
const handleGetRequestOnPostDetail = (request, response, extraData) => {
    const categoryItem = response.locals.categoryItem;

    if(categoryItem.contentType === Type.types.POSTS){
        extraData.components = ComponentController.instances;
    }
};

module.exports = handleGetRequest;