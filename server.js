// dependencies
require('dotenv').config({path: '.env'});
const {address} = require("ip");
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// routing
const adminRouting = require('./routes/admin');

// configs
const {ADMIN_URL} = require("./core/utils/configs");
const {connectDatabase} = require("./core/utils/helpers");

// Init app
const app = express();

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Set up static file
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.redirect('/' + ADMIN_URL);
});

// admin routing
app.use('/' + ADMIN_URL, adminRouting);

// Connect to server
connectDatabase()
    .then(_ => {
        const PORT = process.env.PORT;
        app.listen(PORT, _ => {
            console.log(`Example server listening at http://localhost:${PORT} - http://${address()}:${PORT}`);
        });
    })
    .catch(err => {
        console.error(err);
    });