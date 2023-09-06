const {getParamsOnRequest} = require("../core/utils/helper.utils");
const router = require('express').Router();

const CategoryController = require('../core/classes/category/category-controller');

router.get('*', (req, res, next) => {
    const [type, pageURL] = getParamsOnRequest(req, ['', '']);

    res.locals.params = {
        type, pageURL
    };

    next();
});

router.get('/*', (req, res, next) => {
    const {type, pageURL} = res.locals.params;

    const categoryItem = CategoryController.getCategoryItem(type);
    const promise = !categoryItem ? Promise.reject(new Error('Can not find!')) : categoryItem.databaseModel.findOne({url: pageURL});

    promise
        .then((result) => {
            if(!result) return Promise.reject('Can not find!');
            res.render('default', {
                data: result
            });
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;