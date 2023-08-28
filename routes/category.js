const express = require('express')
const router = express.Router()

const Category = require('../classes/category')
const Content = require("../classes/content");
const {categoryParent} = require('../config')

categoryParent.add(new Category({name: 'Dashboard', url: '/boiler-admin/dashboards', type: 'dashboards'}))
categoryParent.add(new Category({name: 'Post', url: '/boiler-admin/posts', type: 'posts'}))
categoryParent.add(new Category({name: 'Page', url: '/boiler-admin/pages', type: 'pages'}))
categoryParent.add(new Category({name: 'Media', url: '/boiler-admin/media', type: 'media'}))

router.get('/:type', async (req,res) =>{
    const type = req.params.type;
    const categoryItem = categoryParent.getCategoryItem(type)
    const categoryItems = categoryParent.categoryItems

    // Check if url is not valid, return to default url
    if(!categoryItem){
        return res.redirect('/')
    }

    // Check if url is correct, return content of file
    if(type === categoryItem.type){
        const contentInstance = new Content()
        const content = await contentInstance.getHTML(type)
        res.render('admin',{
            username: 'AnhTu',
            content: content,
            categories: categoryItems
        })
    }
})

module.exports = router;