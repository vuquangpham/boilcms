// dependencies
const router = require('express').Router();

// core modules
const Category = require('../../core/classes/category/category');
const CategoryController = require('../../core/classes/category/category-controller');

const Action = require('../../core/classes/utils/action');
const Method = require('../../core/classes/utils/method');
const Type = require('../../core/classes/utils/type');
const ComponentController = require('../../core/classes/component/component-controller');

const {getParamsOnRequest} = require("../../core/utils/helper.utils");
const handleGetMethod = require('./GET');
const handlePostMethod = require('./POST');

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

    // queries
    const action = req.query.action;
    const method = req.query.method;
    const getJSON = req.query.getJSON;

    // categories
    res.locals.categories = CategoryController.categoryItems;
    res.locals.categoryItem = CategoryController.getCategoryItem(type);
    res.locals.action = Action.getActionType(action);
    res.locals.method = Method.getValidatedMethod(method);
    res.locals.getJSON = getJSON;
    res.locals.params = {type};

    next();
});


/**
 * Dynamic page with file type
 * */
router.all('*', (request, response, next) => {
    const method = response.locals.method;

    switch(method.name){
        case 'get':{
            handleGetMethod(request, response);
            break;
        }
        case 'post':{
            handlePostMethod(request, response);
        }
    }
});

router.post('/*', (req, res) => {
    const categoryItem = res.locals.categoryItem;
    const action = res.locals.action;
    const requestData = req.body;

    let promise = Promise.resolve();

    // handle component
    const componentName = req.body.componentName;
    const component = ComponentController.getComponentBasedOnName(componentName);

    switch(action.name){
        case 'get':{
            if(componentName){
                promise = ComponentController.getHTML(component);
            }
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
            if(action.name === 'get' && componentName){
                return res.json({content: result, component: component});
            }

            res.redirect(action.name === 'edit' ? req.get('referer') : req.params.type);
        });
});

module.exports = router;