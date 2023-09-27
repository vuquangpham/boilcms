const path = require("path");
const {CORE_DIRECTORY} = require("../../utils/config.utils");
const fs = require("fs");

class CategoryController{
    constructor(){
        this.instances = [];
        this.init();
    }

    init(){
        const directory = path.join(CORE_DIRECTORY, 'categories');
        fs.readdir(directory, (err, fileNames) => {
            if(err){
                console.error(err);
                return;
            }

            // add to instances
            fileNames.forEach(file => this.instances.push(require(path.join(directory, file))));
            this.instances.sort((a, b) => a.order - b.order);
        });
    }

    /**
     * Get specific category item
     * @param type {string}
     * @return {Object}
     * */
    getCategoryItem(type){
        return this.instances.find(category => category.type === type);
    }

    /**
     * Get special type from categories list
     * */
    getSpecialType(){
        return this.instances.find(category => category.isSpecialType === true);
    }
}

module.exports = new CategoryController;