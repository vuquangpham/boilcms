const Category = require('../classes/category/category');
const Type = require("../classes/utils/type");

class Pages extends Category{
    constructor(config){
        super(config);
    }
}

module.exports = new Pages({
    name: 'Pages',
    url: '/pages',
    type: 'pages',
    contentType: Type.types.POSTS
});