const Category = require('../classes/category/category');
const Type = require("../classes/utils/type");

class Media extends Category{
    constructor(config){
        super(config);
    }
}

module.exports = new Media({
    name: 'Media',
    url: '/media',
    type: 'media',
    contentType: Type.types.MEDIA
});