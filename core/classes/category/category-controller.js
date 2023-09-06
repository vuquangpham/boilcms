class CategoryController{
    constructor(){
        this.categoryItems = [];
    }

    /**
     * Add new category into instance
     * @param category {Object}
     * @return {void}
     * */
    add(category){
        if(!category) return;
        this.categoryItems.push(category);
    }

    /**
     * Get specific category item
     * @param type {string}
     * @return {Object}
     * */
    getCategoryItem(type){
        return this.categoryItems.find(category => category.type === type);
    }

    /**
     * Get special type from categories list
     * */
    getSpecialType(){
        return this.categoryItems.find(category => category.isSpecialType === true);
    }
}

module.exports = new CategoryController;