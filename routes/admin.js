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
const {getParamsOnRequest} = require("../core/utils/helpers");

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
router.all('*', (req, res, next) => {
    // params, default point to the dashboard page
    const [type] = getParamsOnRequest(req, ['default']);

    // action
    const action = req.query.action;

    // categories
    res.locals.categories = CategoryController.categoryItems;
    res.locals.categoryItem = CategoryController.getCategoryItem(type);
    res.locals.validatedAction = Action.getActionType(action);
    res.locals.params = {
        type
    };

    next();
});


/**
 * Dynamic page with file type
 * */
router.get('/*', async(req, res) => {
    const categoryItem = res.locals.categoryItem;
    const action = res.locals.validatedAction;

    if(!categoryItem){
        return res.redirect('/' + ADMIN_URL);
    }

    let promise = Promise.resolve();
    switch(action.name){
        case 'get':{
            promise = categoryItem.getAllData();
            break;
        }
        case 'add':{
            console.log('add here');
            break;
        }
        case 'edit':{
            const id = req.query.id;
            promise = categoryItem.getDataById(id);
            break;
        }
    }

    promise
        .then(result => {
            const data = {
                data: result,
                title: categoryItem.name,
                contentType: categoryItem.contentType.name,
                actionType: action.name,
                type: categoryItem.type
            };

            // render html to fe
            Content.getContentByType(categoryItem.contentType.name, action, data)
                .then(html => {
                    res.render('admin', {
                        content: html,
                    });
                });
        })
        .catch(err => {
            console.error(err);
        });
});

router.post('/:type', async(req, res) => {
    const categoryItem = res.locals.categoryItem;
    const action = res.locals.validatedAction;
    const requestData = req.body;

    let promise = Promise.resolve();

    console.log(action);

    switch(action.name){
        case 'get':{
            break;
        }
        case 'add':{
            promise = categoryItem.add(requestData);
            break;
        }
        case 'edit':{
            const id = req.query.id;
            console.log(req.body, id);
            promise = categoryItem.databaseModel.findOneAndUpdate({_id: id}, req.body);
        }
    }

    promise
        .then(result => {
            console.log(result);
            res.redirect(req.params.type);
        });
});

module.exports = router;