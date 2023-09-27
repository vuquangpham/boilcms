const Category = require('./category');

class POSTS extends Category{
    constructor(config){
        super(config);
    }

    /**
     * Get specific data based on id
     * @return {Promise}
     * */
    getDataById(id){
        return new Promise((resolve, reject) => {
            this.databaseModel.findById(id).populate('content')
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}

module.exports = POSTS;