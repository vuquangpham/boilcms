// dependencies
const express = require('express');
const router = express.Router();

// core modules
const Category = require('../core/classes/category/category');
const CategoryController = require('../core/classes/category/category-controller');

const Content = require("../core/classes/utils/content");
const Action = require('../core/classes/utils/action');
const Type = require('../core/classes/utils/type');
const ComponentController = require('../core/classes/component/component-controller');

const {ADMIN_URL} = require("../core/utils/config.utils");
const {getParamsOnRequest} = require("../core/utils/helper.utils");

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

    // data based on action or category type
    let extraData = {};
    if(categoryItem.contentType === Type.types.POSTS && action.name !== 'get'){
        extraData.components = ComponentController.instances;
    }

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
    console.log(res.locals);
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
            promise = categoryItem.databaseModel.findOneAndUpdate({_id: id}, req.body);
        }
    }

    promise
        .then(result => {
            if(action.name === 'get'){
                return res.json({abc: 'xyz'});
            }

            res.redirect(action.name === 'edit' ? req.get('referer') : req.params.type);
        });
});

module.exports = router;