const fs = require('fs');
const mongoose = require("mongoose");
const {address} = require("ip");

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

    // os
    readFileAsync,

    // database
    connectDatabase,
};
