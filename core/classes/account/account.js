const User = require('./../../database/user/model')

// const filterObj = require('./../../utils/helper.utils')
class Account {
    constructor() {
        this.databaseModel = User
    }

    /**
     * Validate input user
     * */
    validateInputData(request) {
        return {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
            confirmPassword: request.body.confirmPassword
        }
    }

    /**
     * Add new user
     * @param data {object}
     * @return {promise}
     * */
    add(data) {
        const instance = new this.databaseModel(data)

        return new Promise((resolve, reject) => {
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
     * Find user by 1 input of user such as: id, email
     * @param field {string}
     * @return {promise}
     * */
    findUser(field) {
        return new Promise((resolve, reject) => {
            this.databaseModel.findOne(field).select('+password')
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    account(token){
        return new Promise((resolve,reject) => {

        })
    }

    /**
     * Sign in user
     * @return {promise}
     * */
    signIn(request) {
        const { email, password } = request.body;
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.databaseModel.findOne({ email }).select('+password');
                if (!user) {
                    throw new Error('No user found')
                }

                const userModel = new this.databaseModel(user);
                const correctPassword = await userModel.correctPassword(password, user.password);

                if (!correctPassword) {
                    throw new Error('Wrong password')
                }

                resolve(user);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Update user account except password
     * @param id {string}
     * @param data {object}
     * */
    updateUser(id, data) {
        return this.databaseModel.findOneAndUpdate({_id: id}, data);
    }

    /**
     *
     * */
    updatePassword(){

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

module.exports = new Account();