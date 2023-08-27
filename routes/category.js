const express = require('express')
const path = require("path");
const ejs = require("ejs");
const router = express.Router()

const readFileAsync = require('../utils')
const Category = require('../classes/category')
const CategoryParent = require('../classes/category-parent')
const process = require('process');


const parent = new CategoryParent();

parent.add(new Category({name: 'Dashboard', url: '/boiler-admin/dashboards', type: 'dashboards'}))
parent.add(new Category({name: 'Post', url: '/boiler-admin/posts', type: 'posts'}))
parent.add(new Category({name: 'Page', url: '/boiler-admin/pages', type: 'pages'}))
parent.add(new Category({name: 'Media', url: '/boiler-admin/media', type: 'media'}))


    parent.getData()
// Get HTML from category file and File category name === category.type
    const getHtml = async (base) =>{
    const baseFileName = `${base}.ejs`;
    const data = await readFileAsync(path.join(process.cwd(), 'views', baseFileName))
    return ejs.render(data)
}

router.get('/:base', async (req,res) =>{
    const base = req.params.base;
    const checkUrlCategory = parent.check(base)
    const allCategory = parent.getData()

    // Check if url is not valid, return to default url
    if(!checkUrlCategory || base !== checkUrlCategory.type){
        return res.redirect('/')
    }

    // Check if url is correct, return content of file
    if(base === checkUrlCategory.type){
        res.render('admin',{
            username: 'AnhTu',
            content: await getHtml(base),
            category: allCategory
        })
    }
})

module.exports = router;