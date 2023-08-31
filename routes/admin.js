// dependencies
const express = require('express');
const router = express.Router();

// core modules
const Category = require('../core/classes/category');
const Content = require("../core/classes/content");
const CategoryController = require('../core/classes/category-controller');
const {ADMIN_URL} = require("../core/utils/configs");
const Action = require('../core/classes/action');
const Type = require('../core/classes/type');

/**
 * Register categories
 * */
CategoryController.add(new Category({
    name: 'Dashboard',
    url: '/',
    type: 'default',
    contentType: Type.types.DEFAULT
}));
CategoryController.add(new Category({
    name: 'Post',
    url: '/posts',
    type: 'posts',
    contentType: Type.types.POSTS
}));
CategoryController.add(new Category({
    name: 'Pages',
    url: '/pages',
    type: 'pages',
    contentType: Type.types.POSTS
}));
CategoryController.add(new Category({
    name: 'Media',
    url: '/media',
    type: 'media',
    contentType: Type.types.MEDIA
}));

/**
 * Middleware for registering variables
 * */
router.get('*', (req, res, next) => {
    // categories
    res.locals.categories = CategoryController.categoryItems;

    next();
});

/**
 * Middleware for getting categoryItem and action
 * */
router.all('/:type', (req, res, next) => {
    // get the category item
    const categoryItem = CategoryController.getCategoryItem(req.params.type);

    // validate action type on the URL
    const actionType = req.query.action ?? Action.getActionType('default').type;
    const validatedAction = Action.getActionType(actionType);

    res.locals.categoryItem = categoryItem;
    res.locals.validatedAction = validatedAction;

    next();
});

/**
 * Dashboard page
 * */
router.get('/', (req, res) => {
    Content.getContentByType('default', Action.getActionType('default'), {})
        .then(html => {
            res.render('admin', {
                content: html,
            });
        });
});


/**
 * Dynamic page with file type
 * */
router.get('/:type', async(req, res) => {
    const categoryItem = res.locals.categoryItem;
    const action = res.locals.validatedAction;

    if(!categoryItem){
        return res.redirect('/' + ADMIN_URL);
    }

    categoryItem.getAllData()
        .then(dataFromCategory => {
            const data = {
                data: dataFromCategory,
                title: categoryItem.name
            };

            // render html to fe
            Content.getContentByType(categoryItem.contentType.name, action, data)
                .then(html => {
                    res.render('admin', {
                        content: html,
                    });
                });
        });

});

router.post('/:type', async(req, res) => {
    const categoryItem = res.locals.categoryItem;
    const action = res.locals.validatedAction;
    const requestData = req.body;

    let promises = {};

    switch(action.type){
        case 'default':{
            break;
        }
        case 'add':{
            promises = categoryItem.add(requestData);
            break;
        }
        default:{
        }
    }

    Promise.resolve(promises)
        .then(result => {
            console.log(result);
            res.redirect(req.params.type);
        });
});

module.exports = router;