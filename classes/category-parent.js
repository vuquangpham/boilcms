class CategoryParent{
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
        return this.categoryItems.find(category => category.contentType === type);
    }
}

module.exports = new CategoryParent;