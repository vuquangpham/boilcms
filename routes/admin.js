// dependencies
const express = require('express');
const router = express.Router();

// core modules
const Category = require('../core/classes/category');
const Content = require("../core/classes/content");
const CategoryParent = require('../core/classes/category-parent');
const {ADMIN_URL} = require("../core/utils/configs");
const Action = require('../core/classes/action')
/**
 * Register categories
 * */
CategoryParent.add(new Category({
    name: 'Dashboard',
    url: '/',
    type: '',
    contentType: ''
}));
CategoryParent.add(new Category({
    name: 'Post',
    url: '/posts',
    type: 'posts',
    contentType: 'posts'
}));
CategoryParent.add(new Category({
    name: 'Pages',
    url: '/pages',
    type: 'pages',
    contentType: 'posts'
}));
CategoryParent.add(new Category({
    name: 'Media',
    url: '/media',
    type: 'media',
    contentType: 'media'
}));

/**
 * Middleware for register variables
 * */
router.get('*', (req, res, next) => {
    res.locals.categories = CategoryParent.categoryItems;
    next();
});

/**
 * Dashboard page
 * */
router.get('/', (req, res) => {
    Content.getContentByType('default', 'index', {})
        .then(html => {
            res.render('admin', {
                content: html,
            });
        });
});

/**
 * Dynamic page with file type
 * */
router.get('/:type', async (req, res) => {
    const type = req.params.type;
    const categoryItem = CategoryParent.getCategoryItem(type);

    if (!categoryItem) {
        return res.redirect('/' + ADMIN_URL);
    }

    const actionType = req.query.action ?? Action.getActionType('default');
    // console.log(actionType)
    // console.log(Action.getActionType(req.query.action))
    // console.log(Action.isValidAction(actionType))
    if(Action.isValidAction(actionType)){
        const validatedAction = Action.getActionType(actionType)
        // console.log(validatedAction)
        //
        // // if the type doesn't exist => return to default

        Content.getContentByType(categoryItem.contentType, validatedAction, {})
            .then(html => {
                res.render('admin', {
                    content: html
                })
            })
    }
    else{
        return res.redirect('/' + ADMIN_URL)
    }
    // const validatedAction = Action.isValidAction(actionType)



});


module.exports = router;