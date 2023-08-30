const {ADMIN_URL} = require("../utils/configs");
const Type = require('./type');

class Category{
    constructor(options){
        const defaultOptions = {
            name: '',
            url: '',
            type: '',
            contentType: ''
        };

        const validatedOptions = this.validateOptions({defaultOptions, ...options});
        if(!validatedOptions) return null;

        this.name = validatedOptions.name;
        this.url = validatedOptions.url;
        this.type = validatedOptions.type;
        this.contentType = validatedOptions.contentType;
    }

    validateOptions(options){
        // validate content type
        if(!Type.isValidType(options.contentType)) return null;
        options.url = '/' + ADMIN_URL + options.url + (options.contentType && ('?post_type=' + options.contentType));
        return options;
    }
}

module.exports = Category;