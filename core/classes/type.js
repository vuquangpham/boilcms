const DefaultType = require('../database/default/model');
const PostType = require('../database/posts/model');
const MediaType = require('../database/media/model');
const UserType = require('../database/user/model');
const SettingsType = require('../database/settings/model');

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
            },
            SETTINGS: {
                name: 'settings',
                model: SettingsType
            }
        };
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