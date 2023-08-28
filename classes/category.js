class SubCategory {
    constructor(sub) {
        this.name = sub.name;
        this.url = sub.url;
    }
}

class Category {
    constructor(params) {
        this.name = params.name;
        this.url = params.url;
        this.type = params.type;
        // this.subCategory = new SubCategory({name: params.subCategory.subname, url: params.subCategory.suburl})
        this.subCategory = params.subCategory;
    }
}

module.exports = {SubCategory, Category };