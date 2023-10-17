class AccountType{
    constructor(){
        this.types = {
            SIGNIN: {
                name: 'sign-in'
            },
            SIGNUP: {
                name: 'sign-up'
            }
        };
    }

    getValidatedAccountType(type){
        const result = Object.values(this.types).find(instance => instance.name === type);
        return result || this.types.SIGNIN;
    }
}

module.exports = new AccountType();