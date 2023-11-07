const {ADMIN_URL} = require("../../utils/config.utils");
const Type = require('../utils/type');
const mongoose = require("mongoose");

class Category{
    constructor(options){
        const defaultOptions = {
            name: '',
            url: '',
            type: '',
            contentType: '',

            // special type and show in category
            isSpecialType: false,
            notShowInCategory: false,

            // children
            children: [],

            // reorder of category
            order: 0,

            // role can access this data
            acceptRole: ''
        };
        const validatedOptions = this.validateOptions({...defaultOptions, ...options});
        if(!validatedOptions) return null;

        this.name = validatedOptions.name;
        this.url = validatedOptions.url;
        this.type = validatedOptions.type;
        this.contentType = validatedOptions.contentType;
        this.order = validatedOptions.order;
        this.children = validatedOptions.children;

        this.notShowInCategory = validatedOptions.notShowInCategory;
        this.isSpecialType = validatedOptions.isSpecialType;

        this.acceptRole = validatedOptions.acceptRole
    }

    /**
     * Validate options
     * @param options {Object}
     * @return {Object}
     * */
    validateOptions(options){
        // validate content type
        if(!Type.isValidType(options.contentType)) return null;

        // validate URL
        options.url = '/' + ADMIN_URL + options.url + (options.contentType && ('?post_type=' + options.contentType.name));

        // validate database model
        if(options.type && options.contentType.model){
            this.databaseModel = mongoose.model(options.type, options.contentType.model);
        }

        return options;
    }

    /**
     * Validate input data to get the correct data
     * */
    validateInputData(inputData){
        return inputData;
    }

    /**
     * Update data to category
     * */
    update(id, data){
        return new Promise((resolve, reject) => {
            this.databaseModel.findOneAndUpdate({_id: id}, data)
                .then(_ => resolve(this.getDataById({_id: id})))
                .catch(err => reject(err));
        });
    }


    /**
     * Delete data from category
     * */
    delete(id){
        return this.databaseModel.deleteOne({_id: id});
    }


    /**
     * Add new data to category
     * */
    add(data){
        const instance = new this.databaseModel(data);

        return new Promise((resolve, reject) => {
            instance.save()
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }


    /**
     * Get specific data based on id
     * @return {Promise}
     * */
    getDataById(id){
        return new Promise((resolve, reject) => {
            this.databaseModel.findById(id)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }


    /**
     * Get all data from category
     * @return {Promise}
     * */
    getAllData(){
        return new Promise((resolve, reject) => {
            this.databaseModel.find()
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}

module.exports = Category;