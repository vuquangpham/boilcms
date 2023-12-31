const {getParamsOnRequest} = require("../../core/utils/helper.utils");
const router = require('express').Router();

const CategoryController = require('../../core/classes/category/category-controller');
const Content = require('../../core/classes/utils/content');
const {restrictTo} = require("../../core/utils/middleware.utils");

// purify the DOM
const DOMPurify = require('isomorphic-dompurify');

router.get('*', (request, response, next) => {
    const [type, pageURL] = getParamsOnRequest(request, ['', '']);

    // static folder => skip the middleware
    if(type === "upload" || type.includes("favicon")) return;

    response.locals.params = {type, pageURL};
    next();
});

router.get('*', (request, response, next) => {
    let {type, pageURL} = response.locals.params;

    let categoryItem = null;

    // special page type (without "pages" in ex /pages/home)
    if(!pageURL){
        categoryItem = CategoryController.getSpecialCategoryItem();
        pageURL = type;
    }else{
        categoryItem = CategoryController.getCategoryItem(type);
    }

    // promise
    const promise = !categoryItem
        // categoryItem doesn't exist
        ? Promise.reject(new Error('Can not find a category item!'))

        // get the content
        : categoryItem.databaseModel.findOne({url: pageURL}).populate('content');

    // solve promise
    promise
        .then(async(result) => {
            /**
             * Page doesn't exist
             * */
            if(!result) return Promise.reject('Can not find!');

            /**
             * Page is private
             * Restrict role if post/page visibility is private
             * */
            if(result.visibility === 'private' && !restrictTo(response, 'admin')){
                return Promise.reject(`You do not have permission to access the private page!`);
            }

            // page title
            const title = pageURL ? pageURL[0].toUpperCase() + pageURL.slice(1) : 'Home';

            /**
             * Page with custom template
             * */
            if(categoryItem.templates && categoryItem.isCustomTemplate(result.template)){
                // render to frontend
                return response.render('default/templates/' + result.template, {
                    data: result,
                    title,
                });
            }

            /**
             * Page with default template
             * */
            const pageBuilderContent = result.content.content ? JSON.parse(result.content.content) : '';
            const html = await Content.getRenderHTML(pageBuilderContent);

            // render to frontend
            response.render('default', {
                data: result,
                content: DOMPurify.sanitize(html),
                title,
            });
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;