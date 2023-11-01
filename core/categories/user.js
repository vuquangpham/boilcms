const Type = require("../classes/utils/type");
const Category = require("../classes/category/category");
const crypto = require('crypto')

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
        const confirmPassword = request.body.confirmPassword;

        const returnObj = {
            name,
            email,
            password,
            confirmPassword
        };

        if (action === 'edit') {
            returnObj.role = request.body.role;
            returnObj.state = request.body.state;
        }
        return returnObj;
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
    find(id) {
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

                // user doesn't exist
                if (!user) throw new Error('Account not found');

                // comparing the password characters
                const comparePassword = await user.comparePassword(password, user.password);
                if (!comparePassword) throw new Error('Wrong password');

                // found the user
                resolve(user);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Forget password
     * */
    forgetPassword(request) {
        const {email} = request.body;
        return new Promise(async (resolve, reject) => {
            try{
                const user = await this.databaseModel.findOne({email})

                // email doesn't exist
                if (!user) reject(new Error('Email not found'))

                // generate the random reset token and save reset token to data
                const resetToken = user.createPasswordResetToken();
                await user.save({validateBeforeSave: false})

                resolve(resetToken)

            }catch (error){
                reject(error)
            }
        })
    }

    /**
     * Reset password
     * */
    resetPassword(request, resetUrlToken = '') {
        return new Promise(async (resolve, reject) => {
            try{

                // hash token from query
                const hashedToken = crypto
                    .createHash('sha256')
                    .update(resetUrlToken)
                    .digest('hex')

                // check token is valid and dont expired
                const user = await this.databaseModel.findOne({
                    resetPasswordToken: hashedToken,
                    resetPasswordTokenExpired: { $gte: Date.now()}
                })

                // user doesn't exist
                if (!user) {
                    reject(new Error('Account not found'))
                }
                // check password
                if (request.body.password !== request.body.confirmPassword) {
                    reject(new Error(`Password don't match`))
                }

                // get new password and confirm password
                user.password = request.body.password;
                user.confirmPassword = request.body.confirmPassword
                user.resetPasswordToken = undefined;
                user.resetPasswordTokenExpired = undefined

                await user.save()
                resolve()
            }catch(error){
                reject(error)
            }
        })
    }

    /**
     * Update user account except password
     * @param id {string}
     * @param data {object}
     * */
    update(id, data) {
        return new Promise((resolve, reject) => {
            this.databaseModel.findOneAndUpdate({_id: id}, data)
                .then(_ => resolve(this.getDataById({_id: id})))
                .catch(err => reject(err));
        });
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