const {getParamsOnRequest} = require("../../core/utils/helper.utils");
const router = require('express').Router();

const CategoryController = require('../../core/classes/category/category-controller');
const Content = require('../../core/classes/utils/content');

router.get('*', (req, res, next) => {
    const [type, pageURL] = getParamsOnRequest(req, ['', '']);
    res.locals.params = {type, pageURL};
    next();
});

router.get('*', (req, res, next) => {
    let {type, pageURL} = res.locals.params;

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
        ? Promise.reject(new Error('Can not find!'))

        // get the content
        : categoryItem.databaseModel.findOne({url: pageURL}).populate('content');

    // solve promise
    promise
        .then(async(result) => {
            if(!result) return Promise.reject('Can not find!');

            const pageBuilderContent = JSON.parse(result.content.content);
            const html = await Content.getRenderHTML(pageBuilderContent);

            // page title
            const title = pageURL ? pageURL[0].toUpperCase() + pageURL.slice(1) : 'Home';

            // render to frontend
            res.render('default', {
                data: result,
                content: html,
                title
            });
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

module.exports = router;