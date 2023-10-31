const Type = require("../classes/utils/type");
const Category = require("../classes/category/category");

// const filterObj = require('./../../utils/helper.utils')
class User extends Category {
    constructor(config) {
        super(config);
    }

    /**
     * Validate input user
     * */
    validateInputData(inputData, action = 'add') {
        const request = inputData.request;

        // input
        const name = request.body.name.trim();
        const email = request.body.email.trim();
        const password = request.body.password;
        const confirmPassword = request.body.confirmPassword

        const returnObj = {
            name,
            email,
            password,
            confirmPassword
        }

        if (action === 'edit') {
            returnObj.role = request.body.role;
            returnObj.state = request.body.state;
        }
        return returnObj
    }

    /**
     * Add new user
     * @param data {object}
     * @return {promise}
     * */
    add(data) {
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
     * Find user by 1 input of user such as: id, email
     * @param id {string}
     * @return {Promise}
     * */
    findUser(id) {
        return new Promise((resolve, reject) => {
            this.databaseModel.findOne({_id: id}).select('+password')
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    /**
     * Sign in user
     * @return {promise}
     * */
    signIn(request) {
        const {email, password} = request.body;
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.databaseModel.findOne({email}).select('+password');
                if (!user) {
                    throw new Error('Account not found');
                }
                const comparePassword = await user.comparePassword(password, user.password);

                if (!comparePassword) {
                    throw new Error('Wrong password');
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
    update(id, data) {
        return new Promise((resolve, reject) => {
            this.databaseModel.findOneAndUpdate({_id: id}, data)
                .then(_ => resolve(this.getDataById({_id: id})) )
                .catch(err => reject(err))
        })

    }

    /**
     *
     * */
    updatePassword() {

    }

}

module.exports = new User({
    name: 'User',
    url: '/user',
    type: 'user',
    contentType: Type.types.USER,
    children: [
        {
            name: 'Admin',
            url: '?filter=admin'
        }, {
            name: 'User',
            url: '?filter=user'
        }
    ]
});