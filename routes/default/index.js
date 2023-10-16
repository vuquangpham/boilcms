const {getParamsOnRequest} = require("../../core/utils/helper.utils");
const router = require('express').Router();

const CategoryController = require('../../core/classes/category/category-controller');
const Content = require('../../core/classes/utils/content');

router.get('*', (req, res, next) => {
    const [type, pageURL] = getParamsOnRequest(req, ['', '']);

    res.locals.params = {
        type, pageURL
    };

    next();
});

router.get('/*', (req, res, next) => {
    const {type, pageURL} = res.locals.params;

    console.log('type', type, 'pageURL', pageURL);

    const categoryItem = CategoryController.getCategoryItem(type);
    const promise = !categoryItem ? Promise.reject(new Error('Can not find!')) : categoryItem.databaseModel.findOne({url: pageURL}).populate('content');

    promise
        .then(async(result) => {
            if(!result) return Promise.reject('Can not find!');

            const pageBuilderContent = JSON.parse(result.content.content);
            const html = await Content.getRenderHTML(pageBuilderContent);

            res.render('default', {
                data: result,
                content: html,
                title: pageURL[0].toUpperCase() + pageURL.slice(1)
            });
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;