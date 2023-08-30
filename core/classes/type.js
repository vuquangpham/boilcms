class Type{
    constructor(){
        this.types = ['default', 'posts', 'media', 'user', 'custom'];
    }

    /**
     * Validate type
     * @param type {string}
     * @return
     * */
    isValidType(type){
        return this.types.find(t => t === type.toLowerCase().trim()) !== undefined;
    }
}

module.exports = new Type();