const {readFileAsync} = require('../utils/helpers');
const path = require('path');
const ejs = require('ejs');

class Content{

    /**
     * Get content by post_type
     * @param type {string}
     * @param backfile
     * @param data {Object}
     * @return {Promise}
     * */
    getContentByType(type,backfile, data = {}){
        let htmlContent = '';

        return new Promise((resolve) => {
            this.getHTML(type,backfile, data)
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
     * @param backfile
     * @param data {Object}
     * @return {Promise}
     * */
    getHTML(type,backfile, data){
        // const categoryFile = `${type || 'index'}.ejs`;

        return new Promise((resolve, reject) => {
            readFileAsync(path.join(process.cwd(), `core/views/type/${type}`, `${backfile}.ejs`))
                .then(file => resolve(ejs.render(file, data)))
                .catch(err => reject(err));
        });
    }
}

module.exports = new Content();