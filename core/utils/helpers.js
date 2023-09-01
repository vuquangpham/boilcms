const fs = require('fs');
const mongoose = require("mongoose");


/**
 * Get params on the request object
 * @param req {Object}
 * @param defaultParams {Array}
 * @return {Array}
 * */
const getParamsOnRequest = (req, defaultParams) => {
    return req.params['0'].length > 1 ? req.params['0'].split('/').slice(1) : defaultParams;
};


/**
 * Read file in async way
 * @param directory
 * @return {Promise}
 * */
const readFileAsync = (directory) => {
    return new Promise((resolve, reject) => {
        fs.readFile(directory, 'ascii', (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
};

/**
 * Connect to the database
 * @return {Promise}
 * */
const connectDatabase = () => {
    const dbURL = process.env.DB_URI
        .replace('<username>', process.env.DB_USERNAME)
        .replace('<password>', process.env.DB_PASSWORD)
        .replace('<dbname>', process.env.DB_NAME);

    return new Promise((resolve, reject) => {
        mongoose
            .connect(dbURL)
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err);
            });
    });
};


/**
 * Convert string to slug
 * @param string
 * @return string
 * */
const stringToSlug = (string) => {
    if(!string) return '';
    return string.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        .toLowerCase();
};

module.exports = {
    // utils
    stringToSlug,

    // server
    getParamsOnRequest,

    // os
    readFileAsync,

    // database
    connectDatabase,
};
