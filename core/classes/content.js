const {readFileAsync} = require('../utils/helpers');
const {CORE_DIRECTORY} = require('../utils/configs');
const path = require('path');
const ejs = require('ejs');

class Content{

    /**
     * Get content by post_type
     * @param type {string}
     * @param actionType {Object}
     * @param data {Object}
     * @return {Promise}
     * */
    getContentByType(type, actionType, data = {}){
        let htmlContent = '';

        return new Promise((resolve) => {
            this.getHTML(type, actionType, data)
                .then(response => {
                    htmlContent = response;
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    resolve(htmlContent);
                });
        });
    }

    /**
     * Get HTML based on post_type and the data from input
     * @param type {string}
     * @param actionType
     * @param data {Object}
     * @return {Promise}
     * */
    getHTML(type, actionType, data){
        const actionFile = `${actionType.filename}.ejs`;

        return new Promise((resolve, reject) => {
            readFileAsync(path.join(CORE_DIRECTORY, 'views', 'type', type, actionFile))
                .then(file => resolve(ejs.render(file, data)))
                .catch(err => reject(err));
        });
    }
}

module.exports = new Content();