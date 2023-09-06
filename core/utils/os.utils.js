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

module.exports = {
    readFileAsync
};