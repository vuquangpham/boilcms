const express = require('express')
const path = require('path')

// Init app
const app = express();

// Set up view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs')

// Set up static file
app.use(express.static(__dirname + '/public'));
app.get('/',(req,res) =>{
    res.redirect('/boiler-admin/dashboards')
})
app.get('/boiler-admin/',(req,res) =>{
    res.redirect('/boiler-admin/dashboards')
})

let boiler_admin = require('./routes/category')
app.use('/boiler-admin',boiler_admin)

// Run server
app.listen(3000, () =>{
    console.log('Server is running on port 3000')
})



