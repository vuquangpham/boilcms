// dependencies
require('dotenv').config({path: '.env'});
const {address} = require("ip");
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

// routing
const adminRouting = require('./routes/admin');

// configs
const {ADMIN_URL} = require("./utils/configs");

// Init app
const app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up static file
app.use(express.static(path.join(__dirname, 'public')));

// todo: @anhtusngu please remove it when you have done your job
app.get('/', (req, res) => {
    res.redirect('/' + ADMIN_URL);
});

// admin routing
app.use('/' + ADMIN_URL, adminRouting);

// Connect to server
mongoose
    .connect(process.env.DB_URI)
    .then(_ => {
        app.listen(process.env.PORT, _ => {
            console.log(`Example server listening at http://localhost:${process.env.PORT} - http://${address()}:${process.env.PORT}`);
        });
    })
    .catch(err => {
        console.error(err);
    });