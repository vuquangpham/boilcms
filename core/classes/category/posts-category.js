const Category = require('./category');
const {stringToSlug} = require("../../utils/helper.utils");
const PageBuilder = require("../../database/page-builder/model");

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

    /**
     * Validate input data to get the correct data
     * */
    validateInputData(request, action = 'add'){
        const title = request.body.title.trim();
        let url = stringToSlug(title);
        const visibility = request.body.visibility.trim();
        let content = '';

        switch(action){
            case 'add':{
                content = new PageBuilder({
                    content: request.body.content.trim()
                });

                // save to database
                content.save();

                break;
            }
            case 'edit':{
                content = request.body.content;
                url = request.body.url;
            }
        }

        return {
            title,
            url,
            visibility,
            content
        };
    }

    /**
     * Update data to category
     * */
    update(id, data){
        return new Promise((resolve, reject) => {
            this.databaseModel.findById(id).populate('content')
                .then(post => {
                    // update the page builder content
                    const content = post.content;
                    content.content = data.content;

                    // update the post
                    post.title = data.title;
                    post.url = data.url;
                    post.visibility = data.visibility;

                    // resolve
                    Promise.all([content.save(), post.save()])
                        .then(result => resolve(result))
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        });
    }
}

module.exports = POSTS;