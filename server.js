const express = require('express')
const path = require('path')

// Init app
const app = express();

class CategoryParent {
    constructor() {
        this.baseList = [];
    }
    add(category){
        this.baseList.push(category);
    }
    getTypeArray(){
        return this.baseList.map(category => category.type);
        // [ 'posts', 'pages', 'media' ]
    }
    check(base){
        const indexOfType = this.getTypeArray().indexOf(base)
        if(indexOfType !== -1){
            return this.baseList[indexOfType].type
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

parent.add(new Category('Dashboard','/','posts'))
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
        username: 'AnhTu'
    })
})

app.get('/boiler-admin/:base', (req,res) =>{
    const base = req.params.base;
    const matchedTypeUrl = parent.check(base)

    if(!matchedTypeUrl || base !== matchedTypeUrl){
        res.redirect('/')
    }
    if(base === matchedTypeUrl){
        res.render(matchedTypeUrl)
    }
})

// Run server
app.listen(3000, () =>{
    console.log('Server is running on port 3000')
})



