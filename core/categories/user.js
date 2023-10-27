const Type = require("../classes/utils/type");
const Category = require("../classes/category/category");

// const filterObj = require('./../../utils/helper.utils')
class User extends Category{
    constructor(config){
        super(config);
    }

    /**
     * Validate input user
     * */
    validateInputData(request){
        return {
            name: request.body.name,
            email: request.body.email,
            password: request.body.password,
            confirmPassword: request.body.confirmPassword
        };
    }

    /**
     * Add new user
     * @param data {object}
     * @return {promise}
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
     * Find user by 1 input of user such as: id, email
     * @param field {string}
     * @return {promise}
     * */
    findUser(field){
        return new Promise((resolve, reject) => {
            this.databaseModel.findOne(field).select('+password')
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
    signIn(request){
        const {email, password} = request.body;
        return new Promise(async(resolve, reject) => {
            try{
                const user = await this.databaseModel.findOne({email}).select('+password');
                if(!user){
                    throw new Error('No user found');
                }
                const comparePassword = await user.comparePassword(password, user.password);

                if(!comparePassword){
                    throw new Error('Wrong password');
                }

                resolve(user);
            }catch(error){
                reject(error);
            }
        });
    }

    /**
     * Update user account except password
     * @param id {string}
     * @param data {object}
     * */
    updateUser(id, data){
        return this.databaseModel.findOneAndUpdate({_id: id}, data);
    }

    /**
     *
     * */
    updatePassword(){

    }

}

module.exports = new User({
    name: 'User',
    url: '/user',
    type: 'user',
    contentType: Type.types.USER,
    children: [
        {
            name: 'Add new',
            url: ''
        },
        {
            name: 'Admin',
            url: '?filter=admin'
        }, {
            name: 'User',
            url: '?filter=user'
        }
    ]
});