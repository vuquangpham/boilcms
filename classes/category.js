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
        this.subCategories = []
    }
}

module.exports = {SubCategory, Category };