const express = require('express')
const path = require('path')

// Init app
const app = express();

// Set up view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')

app.get('/',(req,res) =>{
    res.render('admin',{
        title: 'Dashboard'
    })
})

// Run server
app.listen(3000, () =>{
console.log('Server is running on port 3000')
})