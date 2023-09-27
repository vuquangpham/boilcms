const Category = require('../classes/category/category');
const Type = require("../classes/utils/type");

class Posts extends Category{
    constructor(config){
        super(config);
    }
}

module.exports = new Posts({
    name: 'Post',
    url: '/posts',
    type: 'posts',
    contentType: Type.types.POSTS
});