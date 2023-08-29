const {readFileAsync} = require('../utils/helpers');
const path = require('path');
const ejs = require('ejs');

class Content{

    /**
     * Get content by post_type
     * @param type {string}
     * @param data {Object}
     * @param onLoad {function}
     * @return {void}
     * */
    getContentByType(type, data, onLoad){
        let htmlContent = '';

        this.getHTML(type, {})
            .then(response => {
                htmlContent = response;
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => {
                onLoad(htmlContent);
            });
    }

    /**
     * Get HTML based on post_type and the data from input
     * @param type {string}
     * @param data {Object}
     * @return {Promise}
     * */
    getHTML(type, data){
        const categoryFile = `${type || 'index'}.ejs`;

        return new Promise((resolve, reject) => {
            readFileAsync(path.join(process.cwd(), 'views', categoryFile))
                .then(file => resolve(ejs.render(file, data)))
                .catch(err => reject(err));
        });
    }
}

module.exports = new Content();