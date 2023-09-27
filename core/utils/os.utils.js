const fs = require('fs');

/**
 * Read file in async way
 * @param directory
 * @return {Promise}
 * */
const readFileAsync = (directory) => {
    return new Promise((resolve, reject) => {
        fs.readFile(directory, 'utf-8', (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
};

/**
 * Read files in a folder
 * @param directory
 * @return {Promise}
 * */
const readFilesInFolderInAsync = (directory) => {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
};

module.exports = {
    readFileAsync,
    readFilesInFolderInAsync
};