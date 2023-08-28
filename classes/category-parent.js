class CategoryParent {
    constructor() {
        this.baseList = [];
    }
    add(category){
        this.baseList.push(category);
    }
    check(base){
        return this.baseList.find(category => category.type === base)
    }
    getData(){
        return this.baseList;
    }
    addSubCategory(){}
}

module.exports = CategoryParent