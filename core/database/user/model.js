const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail]
    },
    password: {
        type: String,
        required: true,
        // Hide password from getting user
        select: false
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function (el) {
                return el === this.password
            },
        }
    },
    setPasswordAt: {
        type: Date,
        default: new Date()
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordTokenExpired: Date
})
module.exports = mongoose.model('User', userSchema)