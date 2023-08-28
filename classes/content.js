const readFileAsync = require('../utils')
const path = require('path')
const ejs = require('ejs')

class Content{
    constructor() {
    }
    // Get HTML from category file and File category name === category.type
    async getHTML(type){
        const typeCategoryFileName = `${type}.ejs`;
        try{
            const data = await readFileAsync(path.join(process.cwd(),'views',typeCategoryFileName))
            return ejs.render(data)
        }catch(err){
            console.log(err);
            throw err;
        }
    }
}
module.exports = Content