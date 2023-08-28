class CategoryParent {
    constructor() {
        this.categoryItems = [];
    }
    add(category){
        this.categoryItems.push(category);
    }
    getCategoryItem(type){
        return this.categoryItems.find(category => category.type === type)
    }
    // categoryItems(){
    //     return this.categoryItems;
    // }
}

module.exports = CategoryParent