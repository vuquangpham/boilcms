const User = require('./../../database/user/model')
// const filterObj = require('./../../utils/helper.utils')
class Account{
    constructor() {
        this.databaseModel = User
    }

    /**
     * Add new user
     * @param data {object}
     * @return {promise}
     * */
    add(data){
        const instance = new this.databaseModel(data)

        return new Promise((resolve,reject) => {
            instance.save()
                .then(result => {
                    resolve(result)
                })
                .catch(err => {
                    reject(err)
                });
        });
    }

    /**
     * Update user account except password
     * @param id {string}
     * @param data {object}
     * */
    updateUser(id, ...data) {
        return this.databaseModel.findOneAndUpdate({_id: id}, data);
    }

    /**
     * Delete user account
     * @param id {string}
     * */
    deleteUser(id) {
        return this.databaseModel.deleteOne({_id: id});
    }

    /**
     * Get all user
     * @return {promise}
     * */
    getAllUser() {
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

module.exports = Account;