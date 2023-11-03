const Type = require("../classes/utils/type");
const Category = require("../classes/category/category");
const {generateSHA256Token, sendAuthTokenAndCookies} = require("../utils/token.utils");

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
        const name = request.body.name;
        const email = request.body.email;
        const password = request.body.password;
        const confirmPassword = request.body.confirmPassword;
        const role = request.body.role;
        const state = request.body.state

        return {
            name,
            email,
            password,
            confirmPassword,
            role,
            state
        };
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
            try {
                const user = await this.databaseModel.findOne({email});

                // email doesn't exist
                if (!user) throw new Error('Email not found');

                // generate the random reset token and save reset token to data
                const resetToken = user.createPasswordResetToken();
                await user.save({validateBeforeSave: false});

                resolve(resetToken);

            } catch (error) {
                reject(error);

            }
        });
    }

    /**
     * Reset password
     * */
    resetPassword(request, token = '') {
        return new Promise(async (resolve, reject) => {
            try {

                // hash token from query
                const hashedToken = generateSHA256Token(token);

                // check token is valid and dont expired
                const user = await this.databaseModel.findOne({
                    resetPasswordToken: hashedToken,
                    resetPasswordTokenExpired: {$gte: Date.now()}
                });

                // user doesn't exist
                if (!user) throw new Error(`The reset token doesn't exist. Please check it again!`);

                // check password
                if (request.body.password !== request.body.confirmPassword) throw new Error(`Password don't match`);

                // get new password and confirm password
                user.password = request.body.password;
                user.confirmPassword = request.body.confirmPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordTokenExpired = undefined;

                await user.save();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Update user data
     * */
    // update(id, data) {
    //     if(data.password !== undefined){
    //         this.updatePassword(id, inputData)
    //     }
    //     return new Promise((resolve, reject) => {
    //         this.databaseModel.findOneAndUpdate({_id: id}, data)
    //             .then(_ => resolve(this.getDataById({_id: id})))
    //             .catch(err => reject(err));
    //     });
    // }

    /**
     * Update password
     * */
    updatePassword(id, inputData) {
        const request = inputData.request;
        const response = inputData.response
        const {currentPassword, password, confirmPassword} = request.body

        return new Promise(async (resolve, reject) => {
            try {
                // find user
                const user = await this.databaseModel.findById(id).select('+password')

                // compare password in database with password from input
                const comparePassword = await user.comparePassword(currentPassword, user.password)
                if (!comparePassword) throw (new Error('The password is not correct'))

                // check password
                if (request.body.password !== request.body.confirmPassword) throw new Error(`Password don't match`);

                // save new password
                user.password = password;
                user.confirmPassword = confirmPassword

                await user.save()

                // send new token and save in cookies
                sendAuthTokenAndCookies(user, response)
                resolve()
            } catch (error) {
                reject(error)
            }
        })
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