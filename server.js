require('dotenv').config({path: '.env'});
const {address} = require("ip");
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')

const {ADMIN_URL} = require("./utils/configs");

// Init app
const app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up static file
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.redirect('/boiler-admin/dashboards');
});


let boilerAdmin = require('./routes/admin');
app.use('/' + ADMIN_URL, boilerAdmin);

// Connect to server
mongoose
    .connect(process.env.DB_URI)
    .then((result) =>{
        console.log('Connect to database')
        app.listen(process.env.PORT, () => {
            console.log(`Example app listening at http://localhost:${process.env.PORT} - http://${address()}:${process.env.PORT}`);
        });
    })
    .catch(err =>{
        console.log(err)
    })


