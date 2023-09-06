const {readFileAsync} = require('../../utils/os.utils');
const {CORE_DIRECTORY} = require('../../utils/configs');
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
            const directory = path.join(CORE_DIRECTORY, 'views', 'custom-type', type, actionType.fileName + '.ejs');

            this.getHTML(directory, data)
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
     * @param directory {string}
     * @param data {Object}
     * @return {Promise}
     * */
    getHTML(directory, data){
        return new Promise((resolve, reject) => {
            console.log('data in render', data);
            readFileAsync(directory)
                .then(file => resolve(ejs.render(file, data)))
                .catch(err => reject(err));
        });
    }
}

module.exports = new Content();