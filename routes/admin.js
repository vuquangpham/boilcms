const express = require('express');
const router = express.Router();

const Category = require('../classes/category');
const Content = require("../classes/content");
const CategoryParent = require('../classes/category-parent');

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
    Content.getContentByType('', {}, (html) => {
        res.render('admin', {
            content: html,
        });
    });
});

/**
 * Dynamic page with file type
 * */
router.get('/:type', async(req, res) => {
    const type = req.params.type;
    const categoryItem = CategoryParent.getCategoryItem(type);

    // if the type doesn't exist => return to dashboard
    if(!categoryItem){
        return res.redirect('/boiler-admin');
    }

    Content.getContentByType(type, {}, (html) => {
        res.render('admin', {
            content: html,
        });
    });
});

module.exports = router;