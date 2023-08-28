const express = require('express')
const path = require("path");
const ejs = require("ejs");
const router = express.Router()

const readFileAsync = require('../utils')
const {SubCategory, Category} = require('../classes/category')
const CategoryParent = require('../classes/category-parent')
const process = require('process');


const parent = new CategoryParent();
const subParent = new CategoryParent();
const subCategoryParams = {
    subname: 'All',
    suburl: '/'
}
// console.log(subCategoryParams)
// const subParent = new SubCategory({name: 'anhtu',url: '/123'})
subParent.add(new SubCategory({name: 'All Post',url: '/25'}))
subParent.add(new SubCategory({name: 'Add New',url: '/1234'}))

parent.add(new Category({name: 'Dashboard', url: '/boiler-admin/dashboards', type: 'dashboards',subCategory: subCategoryParams }))
parent.add(new Category({name: 'Post', url: '/boiler-admin/posts', type: 'posts',subCategory: subCategoryParams}))
parent.add(new Category({name: 'Page', url: '/boiler-admin/pages', type: 'pages',subCategory: subCategoryParams}))
parent.add(new Category({name: 'Media', url: '/boiler-admin/media', type: 'media',subCategory: subParent.getData()[1]}))

console.log('1',subParent.getData()[1])

// console.log(parent.getData())
// Get HTML from category file and File category name === category.type
const getHtml = async (base) =>{
    try{
        const baseFileName = `${base}.ejs`;
        const data = await readFileAsync(path.join(process.cwd(), 'views', baseFileName))
        return ejs.render(data)
    }catch(err){
        console.log(err);
    }
}

router.get('/:base', async (req,res) =>{
    try{
        const base = req.params.base;
        const checkUrlCategory = parent.check(base)
        const allCategory = parent.getData()
        const supCategory = subParent.getData()
        console.log(checkUrlCategory.subCategory)

        // Check if url is not valid, return to default url
        if(!checkUrlCategory || base !== checkUrlCategory.type){
            return res.redirect('/')
        }
        // console.log('123',subParent.getData())

        // Check if url is correct, return content of file
        if(base === checkUrlCategory.type){
            res.render('admin',{
                username: 'AnhTu',
                content: await getHtml(base),
                category: allCategory,
                subParent: supCategory
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }

})

module.exports = router;