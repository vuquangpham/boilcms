const Type = require("../classes/utils/type");
const POSTS = require('../classes/category/posts-category');

module.exports = new POSTS({
    name: 'Post',
    url: '/posts',
    type: 'posts',
    contentType: Type.types.POSTS
});