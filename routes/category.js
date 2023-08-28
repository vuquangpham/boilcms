const express = require('express')
const path = require("path");
const ejs = require("ejs");
const router = express.Router()

const readFileAsync = require('../utils')
const {SubCategory, Category} = require('../classes/category')
const CategoryParent = require('../classes/category-parent')
const process = require('process');


const parent = new CategoryParent();
parent.add(new Category({name: 'Dashboard', url: '/boiler-admin/dashboards', type: 'dashboards'}))
parent.add(new Category({name: 'Post', url: '/boiler-admin/posts', type: 'posts'}))
parent.add(new Category({name: 'Page', url: '/boiler-admin/pages', type: 'pages'}))
parent.add(new Category({name: 'Media', url: '/boiler-admin/media', type: 'media'}))

const subDashBoard = new SubCategory({name: 'DashBoard', url:  '/123'})
const subPosts = new SubCategory({name: 'All Posts',url: '/123'});
const subPosts2 = new SubCategory({name: 'Add Posts',url: '/234'})
const subPage = new SubCategory({name: 'All Pages', url: '/123'})
const subPage2 = new SubCategory({name: 'Add Page', url: '/234'})
const subMedia = new SubCategory({name: 'All Media',url: '/123'})
const subMedia2 = new SubCategory({name: 'Add Media', url: '/1233'})

// const categoryDashboard = parent.check('dashboards');
// categoryDashboard.subCategories.push(subPosts);
// // console.log(categoryDashboard)

const addSubCategoryToParent = (categoryType, nameToAddSubCategory) =>{
    const categoryName = parent.check(categoryType);
    categoryName.subCategories.push(nameToAddSubCategory)
}
addSubCategoryToParent('dashboards',subDashBoard);
addSubCategoryToParent('posts',subPosts);
addSubCategoryToParent('posts',subPosts2);
addSubCategoryToParent('pages',subPage)
addSubCategoryToParent('pages',subPage2)
addSubCategoryToParent('media',subMedia)
addSubCategoryToParent('media',subMedia2)



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

        // Check if url is not valid, return to default url
        if(!checkUrlCategory || base !== checkUrlCategory.type){
            return res.redirect('/')
        }

        // Check if url is correct, return content of file
        if(base === checkUrlCategory.type){
            res.render('admin',{
                username: 'AnhTu',
                content: await getHtml(base),
                category: allCategory,
            })
        }
    }catch(err){
        console.log(err)
        res.status(500).send('Server Error')
    }

})

module.exports = router;