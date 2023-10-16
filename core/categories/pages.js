const Type = require("../classes/utils/type");
const POSTS = require('../classes/category/posts-category');

module.exports = new POSTS({
    name: 'Pages',
    url: '/pages',
    type: 'pages',
    contentType: Type.types.POSTS,
    isSpecialType: true
});