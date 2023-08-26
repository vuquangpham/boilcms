const express = require('express')
const path = require('path')
const ejs = require('ejs')
const readFileAsync = require('./utils')

// Init app
const app = express();

class CategoryParent {
    constructor() {
        this.baseList = [];
    }
    add(category){
        this.baseList.push(category);
    }
    check(base){
        const matchedCategory = this.baseList.find(category => category.type === base)
        if(matchedCategory){
            return matchedCategory
        }
        return false
    }
}
class Category {
    constructor(name,url,type) {
        this.name = name;
        this.url = url;
        this.type = type
    }
}
const parent = new CategoryParent();

parent.add(new Category('Dashboard','/','dashboards'))
parent.add(new Category('Post','/','posts'))
parent.add(new Category('Page','/','pages'))
parent.add(new Category('Media','/','media'))

// Set up view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')

// Set up static file
app.use(express.static(__dirname + '/public'));
app.get('/',(req,res) =>{
    res.redirect('/boiler-admin')
})

app.get('/boiler-admin',(req,res) =>{
    res.render('admin',{
        title: 'Dashboard',
        username: 'AnhTu',
        content: 'Dashboard'
    })
})

app.get('/boiler-admin/:base', async (req,res) =>{
    const base = req.params.base;
    const checkUrlCategory = parent.check(base)

    // Check if url is not valid, return to default url
    if(!checkUrlCategory || base !== checkUrlCategory.type){
        return res.redirect('/')
    }
    // get HTML from category file
    const baseFileName = `${base}.ejs`
    const data = await readFileAsync(path.join(__dirname, 'views', baseFileName))
    const getHtml = ejs.render(data)

    // Check if url is correct, return content of file
    if(base === checkUrlCategory.type){
        res.render('admin',{
            title: 'Dashboard',
            username: 'AnhTu',
            content: getHtml
        })
    }
})

// Run server
app.listen(3000, () =>{
    console.log('Server is running on port 3000')
})



