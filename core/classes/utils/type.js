const DefaultType = require('../../database/default/model');
const PostType = require('../../database/posts/model');
const MediaType = require('../../database/media/model');
const UserType = require('../../database/user/model');

class Type{
    constructor(){
        this.types = {
            DEFAULT: {
                name: 'default',
                model: DefaultType
            },
            POSTS: {
                name: 'posts',
                model: PostType
            },
            MEDIA: {
                name: 'media',
                model: MediaType
            },
            USER: {
                name: 'user',
                model: UserType
            }
        };
    }

    /**
     * Create custom post type
     * */
    createCustomType(name, customType){
        let hasError = false, message = '';
        if(!customType.name && !customType.model){
            message = 'Custom type must have name and model';
            hasError = true;
        }

        if(this.types[name]){
            message = 'Duplicate custom type name';
            hasError = true;
        }

        if(hasError){
            console.error(message);
            return null;
        }

        // register new type
        this.types[name] = customType;
    }

    /**
     * Validate type
     * @param type {string}
     * @return boolean
     * */
    isValidType(type){
        return !!Object.values(this.types).find(instance => instance === type);
    }
}

module.exports = new Type();